import { Button, Center, Loader, Stack, Text } from '@mantine/core';
import { useAuth } from './hooks/useAuth';
import { LoginForm } from './components/LoginForm';

function App() {
  const { user, loading, login, logout } = useAuth();

  if (loading) {
    return (
      <Center h="100vh">
        <Loader />
      </Center>
    );
  }
  if (!user) {
    return <LoginForm onSubmit={login} />;
  }

  return (
    <Center h="100vh">
      <Stack align="center">
        <Text>Hello, {user.username}</Text>
        <Button onClick={logout}>Logout</Button>
      </Stack>
    </Center>
  );
}

export default App;
