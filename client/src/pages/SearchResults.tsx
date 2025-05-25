import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Heading,
  HStack,
  Text,
  Spinner
} from '@chakra-ui/react';
import { useState } from 'react';
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

export default function SearchResults() {
  const [query, setQuery] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [results, setResults] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);


  const search = async () => {
    if (!query.trim()) return;

    const params: Record<string, string> = { q: query };
    if (from) params.from = from;
    if (to) params.to = to;

    setLoading(true);
    try {
        const res = await api.get('/history/search', { params });
        setResults(res.data);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  return (
    <Box>
      <Heading mb={4}>Search History</Heading>

      <HStack spacing={4} mb={4}>
        <FormControl>
          <FormLabel>Keyword</FormLabel>
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g. async, console, fetch" />
        </FormControl>
        <FormControl>
          <FormLabel>From</FormLabel>
          <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>To</FormLabel>
          <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </FormControl>
        <Button onClick={search} mt={6}>
          Search
        </Button>
      </HStack>

      {!loading && results.length === 0 ? (
        <Text>No results yet. Try searching above.</Text>
      ) : (
        loading ? <Spinner /> : <Table variant="simple">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>User</Th>
              <Th>Type</Th>
              <Th>Function</Th>
              <Th>Date</Th>
              <Th>View</Th>
            </Tr>
          </Thead>
          <Tbody>
            {results.map((entry) => (
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
      )}
    </Box>
  );
}
