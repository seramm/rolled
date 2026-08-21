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

function getStops(shotIso: number | null | undefined, boxIso: number): number | null {
  if (!shotIso || shotIso === boxIso) return 0;
  return Math.round(Math.log2(shotIso / boxIso) * 2) / 2;
}
function formatPushPull(stops: number): string {
  if (stops === 0) return 'Box speed';
  return `${stops > 0 ? '+' : ''}${stops} stop${Math.abs(stops) === 1 ? '' : 's'}`;
}

function PushPullBar({ stops }: { stops: number }) {
  const rounded = Math.round(stops);
  const range = Math.max(3, Math.abs(rounded));
  const segments = [];
  for (let i = -range; i <= range; i++) {
    if (i === 0) continue;
    let color = 'var(--mantine-color-gray-2)';
    if (rounded > 0 && i > 0 && i <= rounded) {
      color = 'var(--mantine-color-red-6)';
    } else if (rounded < 0 && i < 0 && i >= rounded) {
      color = 'var(--mantine-color-blue-6)';
    }
    segments.push(<div key={i} style={{ flex: 1, height: 6, borderRadius: 2, backgroundColor: color }} />);
  }
  return <Group gap={2}>{segments}</Group>;
}

export function RollCard({ roll, onUpdate }: RollCardProps) {
  const [framesShot, setFramesShot] = useState(roll.frames_shot);
  const stops = getStops(roll.shot_iso, roll.film_stock.iso);

  return (
    <Card withBorder padding="md">
      <Group justify="space-between" mb="xs">
        <Text fw={500}>
          {roll.film_stock.brand} {roll.film_stock.name}
        </Text>
        <Group gap="xs">
          <Badge color={stops === 0 ? 'gray' : stops > 0 ? 'red' : 'blue'} variant="light">
            {formatPushPull(stops)}
          </Badge>
          <Badge color={statusColors[roll.status] ?? 'gray'}>{roll.status}</Badge>
        </Group>
      </Group>
      <div style={{ marginBottom: 8 }}>
        <PushPullBar stops={stops} />
      </div>
      <Progress value={(roll.frames_shot / roll.film_stock.frames) * 100} size="lg" mb="xs" />
      <Text size="sm" c="dimmed" mb="sm">
        {roll.frames_shot} / {roll.film_stock.frames} frames
        {roll.shot_iso && roll.shot_iso !== roll.film_stock.iso ? ` · shot at ISO ${roll.shot_iso}` : ''}
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
