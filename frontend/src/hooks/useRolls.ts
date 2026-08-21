import { useCallback, useEffect, useState } from 'react';
import client from '../api/client';
import type { components } from '../api/schema';

type Roll = components['schemas']['RollOut'];
type RollIn = components['schemas']['RollIn'];

export function useRolls() {
  const [rolls, setRolls] = useState<Roll[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.GET('/api/rolls/', {}).then(({ data }) => {
      setRolls(data ?? []);
      setLoading(false);
    });
  }, []);

  const refetch = useCallback(async () => {
    const { data } = await client.GET('/api/rolls/', {});
    setRolls(data ?? []);
  }, []);

  const createRoll = useCallback(async (payload: RollIn) => {
    const { data, error } = await client.POST('/api/rolls/', { body: payload });
    if (error || !data) {
      throw new Error('The roll could not be created');
    }
    setRolls((prev) => [...prev, data]);
  }, []);

  return { rolls, loading, createRoll, refetch };
}
