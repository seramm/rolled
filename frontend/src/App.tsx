import { useState } from 'react';
import { Button, Center, Container, Group, Loader, Text, Title } from '@mantine/core';
import { RollList } from './components/RollList';
import { CreateRollForm } from './components/CreateRollForm';
import { useAuth } from './hooks/useAuth';
import { useRolls } from './hooks/useRolls';
import { LoginForm } from './components/LoginForm';
import { useFilmStocks } from './hooks/useFilmStocks';
import { useCameras } from './hooks/useCameras';
import { GearPage } from './pages/GearPage';

function App() {
  const { user, loading, login, logout } = useAuth();
  const { rolls, loading: rollsLoading, createRoll, updateRoll, deleteRoll } = useRolls();
  const { filmStocks } = useFilmStocks();
  const { cameras } = useCameras();
  const [modalOpened, setModalOpened] = useState(false);
  const [view, setView] = useState<'rolls' | 'gear'>('rolls');

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
    <Container size="md" py="xl">
      <Group justify="space-between" mb="lg">
        <Title order={2}>rolled</Title>
        <Group>
          <Button variant={view === 'rolls' ? 'filled' : 'subtle'} onClick={() => setView('rolls')}>
            Rolls
          </Button>
          <Button variant={view === 'gear' ? 'filled' : 'subtle'} onClick={() => setView('gear')}>
            Gear
          </Button>
          <Text size="sm">{user.username}</Text>
          <Button variant="subtle" onClick={logout}>
            Logout
          </Button>
        </Group>
      </Group>

      {view === 'gear' ? (
        <GearPage />
      ) : (
        <>
          <Group justify="space-between" mb="md">
            <Title order={4}>My rolls</Title>
            <Button onClick={() => setModalOpened(true)}>New roll</Button>
          </Group>

          {rollsLoading ? <Loader /> : <RollList rolls={rolls} onUpdate={updateRoll} onDelete={deleteRoll} />}

          <CreateRollForm
            opened={modalOpened}
            onClose={() => setModalOpened(false)}
            filmStocks={filmStocks}
            cameras={cameras}
            onSubmit={createRoll}
          />
        </>
      )}
    </Container>
  );
}

export default App;
