import { useEffect, useState } from 'react';
import client from '../api/client';
import type { components } from '../api/schema';

type FilmStock = components['schemas']['FilmStockOut'];

export function useFilmStocks() {
  const [filmStocks, setFilmStocks] = useState<FilmStock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.GET('/api/film-stocks/', {}).then(({ data }) => {
      setFilmStocks(data ?? []);
      setLoading(false);
    });
  }, []);

  return { filmStocks, loading };
}
