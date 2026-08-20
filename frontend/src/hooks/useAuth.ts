import { useCallback, useEffect, useState } from 'react';
import client from '../api/client';
import type { components } from '../api/schema';

type User = components['schemas']['UserOut'];

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.GET('/api/auth/me').then(({ data }) => {
      setUser(data ?? null);
      setLoading(false);
    });
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const { data, error } = await client.POST('/api/auth/login', {
      body: { username, password },
    });
    if (error) {
      throw new Error(error.detail);
    }
    setUser(data);
  }, []);

  const logout = useCallback(async () => {
    await client.POST('/api/auth/logout', {});
    setUser(null);
  }, []);

  return { user, loading, login, logout };
}
