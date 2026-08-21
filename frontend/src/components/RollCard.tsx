import { useState } from 'react';
import { Badge, Card, Group, NumberInput, Progress, Select, Text } from '@mantine/core';
import type { components } from '../api/schema';

type Roll = components['schemas']['RollOut'];
type RollIn = components['schemas']['RollIn'];

const statusColors: Record<string, string> = {
  stored: 'gray',
  loaded: 'blue',
  started: 'yellow',
  finished: 'orange',
  developed: 'grape',
  scanned: 'green',
};

const statusOptions = [
  { value: 'stored', label: 'Stored' },
  { value: 'loaded', label: 'Loaded' },
  { value: 'started', label: 'Started' },
  { value: 'finished', label: 'Finished' },
  { value: 'developed', label: 'Developed' },
  { value: 'scanned', label: 'Scanned' },
];

interface RollCardProps {
  roll: Roll;
  onUpdate: (roll: Roll, changes: Partial<RollIn>) => Promise<void>;
}

export function RollCard({ roll, onUpdate }: RollCardProps) {
  const [framesShot, setFramesShot] = useState(roll.frames_shot);

  return (
    <Card withBorder padding="md">
      <Group justify="space-between" mb="xs">
        <Text fw={500}>
          {roll.film_stock.brand} {roll.film_stock.name}
        </Text>
        <Badge color={statusColors[roll.status] ?? 'gray'}>{roll.status}</Badge>
      </Group>
      <Progress value={(roll.frames_shot / roll.film_stock.frames) * 100} mb="xs" />
      <Text size="sm" c="dimmed" mb="sm">
        {roll.frames_shot} / {roll.film_stock.frames} frames
        {roll.camera ? ` · ${roll.camera.camera_model.make} ${roll.camera.camera_model.model}` : ''}
      </Text>
      <Group align="flex-end">
        <Select
          label="Status"
          data={statusOptions}
          value={roll.status}
          onChange={(value) => value && onUpdate(roll, { status: value as RollIn['status'] })}
          size="xs"
          w={140}
        />
        <NumberInput
          label="Frames shot"
          min={0}
          max={roll.film_stock.frames}
          value={framesShot}
          onChange={(value) => setFramesShot(Number(value))}
          onBlur={() => onUpdate(roll, { frames_shot: framesShot })}
          size="xs"
          w={140}
        />
      </Group>
    </Card>
  );
}
