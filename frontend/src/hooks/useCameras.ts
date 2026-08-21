import { useEffect, useState } from 'react';
import client from '../api/client';
import type { components } from '../api/schema';

type Camera = components['schemas']['CameraOut'];

export function useCameras() {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.GET('/api/cameras/', {}).then(({ data }) => {
      setCameras(data ?? []);
      setLoading(false);
    });
  }, []);

  return { cameras, loading };
}
