import {
  Box,
  Flex,
  Button,
  FormControl,
  FormLabel,
  Select,
  Textarea,
  Heading,
  Code,
  Spinner,
  VStack,
  Text,
  useToast,
  Collapse
} from '@chakra-ui/react';
import { useState } from 'react';
import { api } from '../api/axios';

const QUEUE_KEY = 'offline-logs';

function queueOfflineEntry(entry: object) {
  const queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
  queue.push(entry);
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}


export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [code, setCode] = useState('');
  const [type, setType] = useState('comment');
  const [model, setModel] = useState('phi');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const generate = async () => {
    if (!prompt || !code) {
      toast({
        title: 'Missing input',
        description: 'Prompt and code are required.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    const payload = {
        prompt,
        code,
        module: 'demo',
        functionName: 'demoFunction',
        type,
        model
      };
    try {
      const res = await api.post('/generate', payload);
      setResponse(res.data.result || '');
    } catch (err) {
    //   toast({
    //     title: 'Error',
    //     description: 'Generation failed. Check the backend.',
    //     status: 'error',
    //     duration: 3000,
    //     isClosable: true,
    //   });
      console.warn('❌ Offline or backend failed, queueing...');
      console.log(err);
      queueOfflineEntry(payload);
    } finally {
      setLoading(false);
    }
  };
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value;
    setType(newType);

    // Only fill in default prompt if it's currently empty
    if (newType === 'analysis') {
        setPrompt('Please analyse next piece of code');
    } else if (newType === 'comment') {
        setPrompt('Please add comments section to the code snippet below');
    } else if (newType === 'test') {
        setPrompt('Please write test cases for the code below');
    }
    };


  return (
  <Flex minH="100vh" align="center" justify="center" bg="gray.50" p={4}>
    <Box w="100%" maxW="700px" p={6} borderRadius="md" boxShadow="md" bg="white">
      <Heading mb={6} textAlign="center">🧠 Prompt Generator</Heading>

      {/* Collapse the form when response is shown */}
      <Collapse in={!response} animateOpacity>
        <VStack align="stretch" spacing={4}>
          <FormControl isRequired>
            <FormLabel>Prompt</FormLabel>
            <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Input Code</FormLabel>
            <Textarea value={code} onChange={(e) => setCode(e.target.value)} rows={6} />
          </FormControl>

          <FormControl>
            <FormLabel>Prompt Type</FormLabel>
            <Select value={type} onChange={handleTypeChange}>
                <option value="comment">Comment</option>
                <option value="test">Test</option>
                <option value="analysis">Analysis</option>
            </Select>
          </FormControl>


          <FormControl>
            <FormLabel>Model</FormLabel>
            <Select value={model} onChange={(e) => setModel(e.target.value)}>
              <option value="phi">phi</option>
              <option value="codellama">codellama</option>
              <option value="mistral">mistral</option>
            </Select>
          </FormControl>

          <Button onClick={generate} colorScheme="teal" isDisabled={loading}>
            {loading ? <Spinner size="sm" /> : 'Generate'}
          </Button>
        </VStack>
      </Collapse>

      {response && (
        <Box mt={6}>
          <Text fontWeight="bold" mb={2}>LLM Response:</Text>
          <Code display="block" whiteSpace="pre-wrap" p={4} fontSize="sm">
            {response}
          </Code>

          <Button mt={4} onClick={() => setResponse('')}>
            🔁 Generate Again
          </Button>
        </Box>
      )}
    </Box>
  </Flex>
);
}
