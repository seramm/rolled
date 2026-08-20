import { useState } from 'react';
import { Button, Paper, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';

interface LoginFormProps {
  onSubmit: (username: string, password: string) => Promise<void>;
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const [error, setError] = useState<string | null>(null);
  const form = useForm({ initialValues: { username: '', password: '' } });

  const handleSubmit = form.onSubmit(async (values) => {
    setError(null);
    try {
      await onSubmit(values.username, values.password);
    } catch {
      setError('Username or password incorrect');
    }
  });
  return (
    <Paper withBorder shadow="sm" p="xl" maw={360} mx="auto" mt="xl">
      <Title order={2} mb="md">
        rolled
      </Title>
      <form onSubmit={handleSubmit}>
        <Stack>
          <TextInput label="Username" required {...form.getInputProps('username')} />
          <PasswordInput label="Password" required {...form.getInputProps('password')} />
          {error && (
            <Text c="red" size="sm">
              {error}
            </Text>
          )}
          <Button type="submit">Login</Button>
        </Stack>
      </form>
    </Paper>
  );
}
