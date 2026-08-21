import { useCallback, useEffect, useState } from 'react';
import client from '../api/client';
import type { components } from '../api/schema';

type Camera = components['schemas']['CameraOut'];
type CameraIn = components['schemas']['CameraIn'];

export function useCameras() {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.GET('/api/cameras/', {}).then(({ data }) => {
      setCameras(data ?? []);
      setLoading(false);
    });
  }, []);

  const createCamera = useCallback(async (payload: CameraIn) => {
    const { data, error } = await client.POST('/api/cameras/', { body: payload });
    if (error || !data) {
      throw new Error('The camera could not be created');
    }
    setCameras((prev) => [...prev, data]);
  }, []);

  const deleteCamera = useCallback(async (cameraId: string) => {
    const { error } = await client.DELETE('/api/cameras/{camera_id}', {
      params: { path: { camera_id: cameraId } },
    });
    if (error) {
      throw new Error('The camera could not be deleted');
    }
    setCameras((prev) => prev.filter((c) => c.id !== cameraId));
  }, []);

  return { cameras, loading, createCamera, deleteCamera };
}
