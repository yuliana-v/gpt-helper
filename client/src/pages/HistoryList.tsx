import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Table,
  Tbody,
  Text,
  Td,
  Th,
  Thead,
  Tr,
  Heading,
  HStack,
  Spinner
} from '@chakra-ui/react';
import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/axios';

interface HistoryItem {
  id: number;
  user_id: string;
  prompt: string;
  input_code: string;
  response: string;
  type: string;
  module: string;
  function_name: string;
  created_at: string;
}

export default function HistoryList() {
  const [data, setData] = useState<HistoryItem[]>([]);
  const [type, setType] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [loading, setLoading] = useState(false);


    const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
        const params: Record<string, string> = {};
        if (type) params.type = type;
        if (from) params.from = from;
        if (to) params.to = to;

        const res = await api.get('/history', { params });
        setData(res.data.data);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
    }, [type, from, to]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return (
    <Box>
      <Heading mb={4}>History</Heading>

      <HStack spacing={4} mb={4}>
        <FormControl>
          <FormLabel>Type</FormLabel>
          <Select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">All</option>
            <option value="comment">Comment</option>
            <option value="test">Test</option>
            <option value="analysis">Analysis</option>
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>From</FormLabel>
          <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>To</FormLabel>
          <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </FormControl>
        <Button onClick={fetchHistory} mt={6}>
          Filter
        </Button>
      </HStack>

     {!loading && data.length === 0 ? (
        <Text>No results yet. Try searching above.</Text>
      ) : (loading ? <Spinner /> : ( <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>User</Th>
            <Th>Type</Th>
            <Th>Function</Th>
            <Th>Created</Th>
            <Th>View</Th>
          </Tr>
        </Thead>
        <Tbody>
          {Array.isArray(data) && data?.map((entry) => (
            <Tr key={entry.id}>
              <Td>{entry.id}</Td>
              <Td>{entry.user_id}</Td>
              <Td>{entry.type}</Td>
              <Td>{entry.function_name}</Td>
              <Td>{entry.created_at.slice(0, 10)}</Td>
              <Td>
                <Button as={Link} to={`/history/entry/${entry.id}`} size="sm" colorScheme="teal">
                  View
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    ))}
    </Box>
  );
}
