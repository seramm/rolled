import { Stack, Text } from '@mantine/core';
import type { components } from '../api/schema';
import { RollCard } from './RollCard';

type Roll = components['schemas']['RollOut'];
type RollIn = components['schemas']['RollIn'];

interface RollListProps {
  rolls: Roll[];
  onUpdate: (roll: Roll, changes: Partial<RollIn>) => Promise<void>;
  onDelete: (rollId: string) => Promise<void>;
}

export function RollList({ rolls, onUpdate, onDelete }: RollListProps) {
  if (rolls.length === 0) {
    return <Text c="dimmed">No rolls so far.</Text>;
  }

  return (
    <Stack>
      {rolls.map((roll) => (
        <RollCard key={roll.id} roll={roll} onUpdate={onUpdate} onDelete={onDelete} />
      ))}
    </Stack>
  );
}
