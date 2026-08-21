import { Badge, Card, Group, Progress, Stack, Text } from '@mantine/core';
import type { components } from '../api/schema';

type Roll = components['schemas']['RollOut'];

const statusColors: Record<string, string> = {
  stored: 'gray',
  loaded: 'blue',
  started: 'yellow',
  finished: 'orange',
  developed: 'grape',
  scanned: 'green',
};

interface RollListProps {
  rolls: Roll[];
}

export function RollList({ rolls }: RollListProps) {
  if (rolls.length === 0) {
    return <Text c="dimmed">No rolls so far.</Text>;
  }

  return (
    <Stack>
      {rolls.map((roll) => (
        <Card key={roll.id} withBorder padding="md">
          <Group justify="space-between" mb="xs">
            <Text fw={500}>
              {roll.film_stock.brand} {roll.film_stock.name}
            </Text>
            <Badge color={statusColors[roll.status] ?? 'gray'}>{roll.status}</Badge>
          </Group>
          <Progress value={(roll.frames_shot / roll.film_stock.frames) * 100} mb="xs" />
          <Text size="sm" c="dimmed">
            {roll.frames_shot} / {roll.film_stock.frames} frames
            {roll.camera ? ` · ${roll.camera.camera_model.make} ${roll.camera.camera_model.model}` : ''}
          </Text>
        </Card>
      ))}
    </Stack>
  );
}
