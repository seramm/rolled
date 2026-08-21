import { useCallback, useEffect, useState } from 'react';
import client from '../api/client';
import type { components } from '../api/schema';

type CameraModel = components['schemas']['CameraModelOut'];
type CameraModelIn = components['schemas']['CameraModelIn'];

export function useCameraModels() {
  const [cameraModels, setCameraModels] = useState<CameraModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.GET('/api/camera-models/', {}).then(({ data }) => {
      setCameraModels(data ?? []);
      setLoading(false);
    });
  }, []);

  const createCameraModel = useCallback(async (payload: CameraModelIn) => {
    const { data, error } = await client.POST('/api/camera-models/', { body: payload });
    if (error || !data) {
      throw new Error('The camera model could not be created');
    }
    setCameraModels((prev) => [...prev, data]);
  }, []);

  const deleteCameraModel = useCallback(async (cameraModelId: string) => {
    const { error } = await client.DELETE('/api/camera-models/{camera_model_id}', {
      params: { path: { camera_model_id: cameraModelId } },
    });
    if (error) {
      throw new Error('The film stock could not be deleted');
    }
    setCameraModels((prev) => prev.filter((fs) => fs.id !== cameraModelId));
  }, []);

  return { cameraModels, loading, createCameraModel, deleteCameraModel };
}
