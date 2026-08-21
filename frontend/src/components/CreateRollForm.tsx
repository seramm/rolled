import { useState } from 'react';
import type { components } from '../api/schema';
import { useForm } from '@mantine/form';
import { Button, Modal, Select, Stack, Text, TextInput } from '@mantine/core';

type FilmStock = components['schemas']['FilmStockOut'];
type Camera = components['schemas']['CameraOut'];
type RollIn = components['schemas']['RollIn'];

interface CreateRollFormProps {
  opened: boolean;
  onClose: () => void;
  filmStocks: FilmStock[];
  cameras: Camera[];
  onSubmit: (payload: RollIn) => Promise<void>;
}

export function CreateRollForm({ opened, onClose, filmStocks, cameras, onSubmit }: CreateRollFormProps) {
  const [error, setError] = useState<string | null>(null);
  const form = useForm({
    initialValues: { film_stock_id: '', camera_id: '', expiration_date: '', notes: '' },
  });
  const handleSubmit = form.onSubmit(async (values) => {
    setError(null);
    try {
      await onSubmit({
        film_stock_id: values.film_stock_id,
        camera_id: values.camera_id || null,
        status: 'stored',
        frames_shot: 0,
        expiration_date: values.expiration_date,
        notes: values.notes,
      });
      form.reset();
      onClose();
    } catch {
      setError('Cannot create roll');
    }
  });
  return (
    <Modal opened={opened} onClose={onClose} title="New roll">
      <form onSubmit={handleSubmit}>
        <Stack>
          <Select
            label="Film"
            required
            data={filmStocks.map((fs) => ({ value: fs.id, label: `${fs.brand} ${fs.name}` }))}
            {...form.getInputProps('film_stock_id')}
          />
          <Select
            label="Camera (optional)"
            clearable
            data={cameras.map((c) => ({ value: c.id, label: `${c.camera_model.make} ${c.camera_model.model}` }))}
            {...form.getInputProps('camera_id')}
          />
          <TextInput label="Expiration date" type="date" required {...form.getInputProps('expiration_date')} />
          <TextInput label="Notes" {...form.getInputProps('notes')} />
          {error && (
            <Text c="red" size="sm">
              {error}
            </Text>
          )}
          <Button type="submit">Create</Button>
        </Stack>
      </form>
    </Modal>
  );
}
