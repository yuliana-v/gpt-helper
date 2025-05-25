import { useState } from 'react';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../context/AuthContext';
import {
  Box, Input, Button, VStack, Text
} from '@chakra-ui/react';

export default function LoginPanel() {
  const { user, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (loading) return <Text>Checking auth...</Text>;

  if (user) {
    return (
      <Box>
        <Text mb={2}>Logged in as {user.email}</Text>
        <Button onClick={() => signOut(auth)} colorScheme="red">Logout</Button>
      </Box>
    );
  }

  return (
    <VStack spacing={3}>
      <Input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <Button
        onClick={() => signInWithEmailAndPassword(auth, email, password)}
        colorScheme="teal"
      >
        Log In
      </Button>
    </VStack>
  );
}
