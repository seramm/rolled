import { useCallback, useEffect, useState } from 'react';
import client from '../api/client';
import type { components } from '../api/schema';

type FilmStock = components['schemas']['FilmStockOut'];
type FilmStockIn = components['schemas']['FilmStockIn'];

export function useFilmStocks() {
  const [filmStocks, setFilmStocks] = useState<FilmStock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.GET('/api/film-stocks/', {}).then(({ data }) => {
      setFilmStocks(data ?? []);
      setLoading(false);
    });
  }, []);

  const createFilmStock = useCallback(async (payload: FilmStockIn) => {
    const { data, error } = await client.POST('/api/film-stocks/', { body: payload });
    if (error || !data) {
      throw new Error('The film stock could not be created');
    }
    setFilmStocks((prev) => [...prev, data]);
  }, []);

  const deleteFilmStock = useCallback(async (filmStockId: string) => {
    const { error } = await client.DELETE('/api/film-stocks/{film_stock_id}', {
      params: { path: { film_stock_id: filmStockId } },
    });
    if (error) {
      throw new Error('The film stock could not be deleted');
    }
    setFilmStocks((prev) => prev.filter((fs) => fs.id !== filmStockId));
  }, []);

  return { filmStocks, loading, createFilmStock, deleteFilmStock };
}
