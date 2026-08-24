import { useState } from 'react';
import { Badge, Button, Card, Group, Modal, NumberInput, Select, Text } from '@mantine/core';
import type { components } from '../api/schema';

type Roll = components['schemas']['RollOut'];
type RollIn = components['schemas']['RollIn'];

const EXPIRATION_WARNING_DAYS = 90;

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
  onDelete: (rollId: string) => Promise<void>;
}

function getTimeToExpire(expirationDate: string) {
  // TODO: prase expirationDate to avoid UTC-vs-local offset
  const daysToExpire = (new Date(expirationDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24);

  if (daysToExpire <= 0) {
    return { label: `Expired on ${expirationDate}`, color: 'red' };
  } else if (daysToExpire < EXPIRATION_WARNING_DAYS) {
    return { label: `To expire on ${expirationDate}`, color: 'yellow' };
  }
  return null;
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

function Sprockets() {
  const holes = Array.from({ length: 100 });
  return (
    <Group gap={4} justify="space-between" px={4}>
      {holes.map((_, i) => (
        <div key={i} style={{ width: 2, height: 3, borderRadius: 1, backgroundColor: 'var(--mantine-color-gray-5)' }} />
      ))}
    </Group>
  );
}

function FramesBar({ shotFrames, filmStockFrames }: { shotFrames: number; filmStockFrames: number }) {
  const segments = [];
  for (let i = 0; i < filmStockFrames; i++) {
    const shot = i < shotFrames;
    segments.push(
      <div
        key={i}
        style={{
          flex: 1,
          aspectRatio: '3/2',
          backgroundColor: shot ? 'var(--mantine-color-blue-6)' : 'var(--mantine-color-dark-3)',
          border: '1px solid var(--mantine-color-dark-3)',
        }}
      />,
    );
  }

  return (
    <Group gap={0} my={2} wrap="nowrap" align="center">
      <div
        style={{
          position: 'relative',
          flex: 1,
          marginLeft: 15,
          backgroundColor: 'var(--mantine-color-dark-8)',
          padding: '2px 8px',
          borderRadius: 4,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: -15,
            top: -5,
            bottom: -5,
            width: 22,
            backgroundColor: 'var(--mantine-color-dark-6)',
            border: '1px solid var(--mantine-color-gray-5)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: -7,
            top: -10,
            width: 6,
            height: 6,
            backgroundColor: 'var(--mantine-color-gray-5)',
          }}
        />
        <Sprockets />
        <Group gap={1} my={2}>
          {segments}
        </Group>
        <Sprockets />
      </div>
    </Group>
  );
}

export function RollCard({ roll, onUpdate, onDelete }: RollCardProps) {
  const [framesShot, setFramesShot] = useState(roll.frames_shot);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const stops = getStops(roll.shot_iso, roll.film_stock.iso);
  const expirationWarning = getTimeToExpire(roll.expiration_date);

  const handleDelete = async () => {
    await onDelete(roll.id);
    setDeleteModalOpened(false);
  };

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
          {expirationWarning && <Badge color={expirationWarning.color}>{expirationWarning.label}</Badge>}
          <Badge color={statusColors[roll.status] ?? 'gray'}>{roll.status}</Badge>
        </Group>
      </Group>
      <div style={{ marginBottom: 15 }}>
        <PushPullBar stops={stops} />
      </div>
      <FramesBar shotFrames={roll.frames_shot} filmStockFrames={roll.film_stock.frames} />
      <Text size="sm" c="dimmed" mt="xs" mb="sm">
        {roll.frames_shot} / {roll.film_stock.frames} frames · {roll.film_stock.color_type}
        {roll.shot_iso && roll.shot_iso !== roll.film_stock.iso ? ` · shot at ISO ${roll.shot_iso}` : ''}
        {roll.camera ? ` · ${roll.camera.camera_model.make} ${roll.camera.camera_model.model}` : ''}
      </Text>
      <Group align="flex-end" justify="space-between">
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
        <Button color="red" variant="subtle" size="xs" onClick={() => setDeleteModalOpened(true)}>
          Delete
        </Button>
      </Group>
      <Modal opened={deleteModalOpened} onClose={() => setDeleteModalOpened(false)} title="Delete roll">
        <Text mb="md">
          Delete {roll.film_stock.brand} {roll.film_stock.name}? This cannot be undone.
        </Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={() => setDeleteModalOpened(false)}>
            Cancel
          </Button>
          <Button color="red" onClick={handleDelete}>
            Delete
          </Button>
        </Group>
      </Modal>
    </Card>
  );
}
