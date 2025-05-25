import type { ReactNode } from 'react'; // ✅ required with verbatimModuleSyntax
import { Box, Flex, HStack, Link, Spacer, Text } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <Box>
      <Flex
        as="nav"
        bg="teal.500"
        color="white"
        px={6}
        py={3}
        align="center"
        boxShadow="md"
      >
        <Text fontWeight="bold" fontSize="xl">
          <Link as={RouterLink} to="/">GPT CodeGen</Link>
        </Text>
        <Spacer />
        <HStack spacing={4}>
          <Link as={RouterLink} to="/history">History</Link>
          <Link as={RouterLink} to="/search">Search</Link>
        </HStack>
      </Flex>
      <Box px={6} py={4}>
        {children}
      </Box>
    </Box>
  );
}
