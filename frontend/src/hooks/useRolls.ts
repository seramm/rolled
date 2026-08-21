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

  const updateRoll = useCallback(async (roll: Roll, changes: Partial<RollIn>) => {
    const payload: RollIn = {
      film_stock_id: roll.film_stock.id,
      camera_id: roll.camera?.id ?? null,
      status: roll.status,
      frames_shot: roll.frames_shot,
      expiration_date: roll.expiration_date,
      date_bought: roll.date_bought,
      date_started: roll.date_started,
      date_loaded: roll.date_loaded,
      date_finished: roll.date_finished,
      date_developed: roll.date_developed,
      date_scanned: roll.date_scanned,
      notes: roll.notes,
      ...changes,
    };
    const { data, error } = await client.PUT('/api/rolls/{roll_id}', {
      params: { path: { roll_id: roll.id } },
      body: payload,
    });
    if (error || !data) {
      throw new Error('The roll could not be updated ');
    }
    setRolls((prev) => prev.map((r) => (r.id === data.id ? data : r)));
  }, []);

  return { rolls, loading, createRoll, updateRoll, refetch };
}
