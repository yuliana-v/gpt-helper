import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  Code,
  Spinner,
  Stack,
  Badge
} from '@chakra-ui/react';
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

export default function HistoryDetail() {
  const { id } = useParams();
  const [entry, setEntry] = useState<HistoryItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const res = await api.get(`/history/entry/${id}`);
        setEntry(res.data);
      } catch (err) {
        console.error('Failed to fetch entry:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEntry();
  }, [id]);

  if (loading) return <Spinner />;

  if (!entry) return <Text>Entry not found.</Text>;

  return (
    <Box>
      <Heading mb={2}>Entry #{entry.id}</Heading>
      <Stack spacing={2} mb={4}>
        <Text><strong>User:</strong> {entry.user_id}</Text>
        <Text><strong>Type:</strong> <Badge>{entry.type}</Badge></Text>
        <Text><strong>Function:</strong> {entry.function_name}</Text>
        <Text><strong>Module:</strong> {entry.module}</Text>
        <Text><strong>Date:</strong> {entry.created_at.slice(0, 10)}</Text>
      </Stack>

      <Box mb={4}>
        <Text fontWeight="bold">Prompt:</Text>
        <Code p={2} display="block" whiteSpace="pre-wrap">{entry.prompt}</Code>
      </Box>

      <Box mb={4}>
        <Text fontWeight="bold">Input Code:</Text>
        <Code p={2} display="block" whiteSpace="pre-wrap">{entry.input_code}</Code>
      </Box>

      <Box>
        <Text fontWeight="bold">Generated Response:</Text>
        <Code p={2} display="block" whiteSpace="pre-wrap">{entry.response}</Code>
      </Box>
    </Box>
  );
}
