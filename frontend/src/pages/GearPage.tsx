import { useState } from 'react';
import { Badge, Button, Group, NumberInput, Paper, Select, Stack, Tabs, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useCameraModels } from '../hooks/useCameraModels';
import { useCameras } from '../hooks/useCameras';
import { useFilmStocks } from '../hooks/useFilmStocks';

function FilmStocksSection() {
  const { filmStocks, createFilmStock, deleteFilmStock } = useFilmStocks();
  const form = useForm({
    initialValues: { brand: '', name: '', iso: 100, format: '', color_type: '', frames: 36 },
    validate: {
      brand: (v) => (v ? null : 'Required'),
      name: (v) => (v ? null : 'Required'),
      format: (v) => (v ? null : 'Required'),
      color_type: (v) => (v ? null : 'Required'),
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    await createFilmStock(values);
    form.reset();
  });

  return (
    <Stack mt="md">
      <Paper withBorder p="md">
        <form onSubmit={handleSubmit}>
          <Group align="flex-end">
            <TextInput label="Brand" {...form.getInputProps('brand')} />
            <TextInput label="Name" {...form.getInputProps('name')} />
            <NumberInput label="ISO" min={1} {...form.getInputProps('iso')} />
            <TextInput label="Format" placeholder="35mm" {...form.getInputProps('format')} />
            <TextInput label="Color type" placeholder="Color negative" {...form.getInputProps('color_type')} />
            <NumberInput label="Frames" min={1} {...form.getInputProps('frames')} />
            <Button type="submit">Add</Button>
          </Group>
        </form>
      </Paper>
      <Stack gap="xs">
        {filmStocks.map((fs) => (
          <Paper withBorder p="sm" key={fs.id}>
            <Group justify="space-between">
              <Group gap="xs">
                <Text fw={500}>
                  {fs.brand} {fs.name}
                </Text>
                <Badge variant="light">ISO {fs.iso}</Badge>
                <Badge variant="light">{fs.format}</Badge>
                <Badge variant="light">{fs.color_type}</Badge>
                <Badge variant="light">{fs.frames} frames</Badge>
              </Group>
              <Button color="red" variant="subtle" size="xs" onClick={() => deleteFilmStock(fs.id)}>
                Delete
              </Button>
            </Group>
          </Paper>
        ))}
      </Stack>
    </Stack>
  );
}

function CameraModelsSection() {
  const { cameraModels, createCameraModel, deleteCameraModel } = useCameraModels();
  const form = useForm({
    initialValues: { make: '', model: '', format: '' },
    validate: {
      make: (v) => (v ? null : 'Required'),
      model: (v) => (v ? null : 'Required'),
      format: (v) => (v ? null : 'Required'),
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    await createCameraModel(values);
    form.reset();
  });

  return (
    <Stack mt="md">
      <Paper withBorder p="md">
        <form onSubmit={handleSubmit}>
          <Group align="flex-end">
            <TextInput label="Make" {...form.getInputProps('make')} />
            <TextInput label="Model" {...form.getInputProps('model')} />
            <TextInput label="Format" placeholder="35mm" {...form.getInputProps('format')} />
            <Button type="submit">Add</Button>
          </Group>
        </form>
      </Paper>
      <Stack gap="xs">
        {cameraModels.map((cm) => (
          <Paper withBorder p="sm" key={cm.id}>
            <Group justify="space-between">
              <Group gap="xs">
                <Text fw={500}>
                  {cm.make} {cm.model}
                </Text>
                <Badge variant="light">{cm.format}</Badge>
              </Group>
              <Button color="red" variant="subtle" size="xs" onClick={() => deleteCameraModel(cm.id)}>
                Delete
              </Button>
            </Group>
          </Paper>
        ))}
      </Stack>
    </Stack>
  );
}

function CamerasSection() {
  const { cameras, createCamera, deleteCamera } = useCameras();
  const { cameraModels } = useCameraModels();
  const form = useForm({
    initialValues: { camera_model_id: '' },
    validate: {
      camera_model_id: (v) => (v ? null : 'Select a camera model'),
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    await createCamera(values);
    form.reset();
  });

  return (
    <Stack mt="md">
      <Paper withBorder p="md">
        <form onSubmit={handleSubmit}>
          <Group align="flex-end">
            <Select
              label="Camera model"
              data={cameraModels.map((cm) => ({ value: cm.id, label: `${cm.make} ${cm.model}` }))}
              {...form.getInputProps('camera_model_id')}
            />
            <Button type="submit">Add</Button>
          </Group>
        </form>
      </Paper>
      <Stack gap="xs">
        {cameras.map((c) => (
          <Paper withBorder p="sm" key={c.id}>
            <Group justify="space-between">
              <Text fw={500}>
                {c.camera_model.make} {c.camera_model.model}
              </Text>
              <Button color="red" variant="subtle" size="xs" onClick={() => deleteCamera(c.id)}>
                Delete
              </Button>
            </Group>
          </Paper>
        ))}
      </Stack>
    </Stack>
  );
}

export function GearPage() {
  const [tab, setTab] = useState<string | null>('film-stocks');

  return (
    <Tabs value={tab} onChange={setTab}>
      <Tabs.List>
        <Tabs.Tab value="film-stocks">Film stocks</Tabs.Tab>
        <Tabs.Tab value="camera-models">Camera models</Tabs.Tab>
        <Tabs.Tab value="cameras">My cameras</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="film-stocks">
        <FilmStocksSection />
      </Tabs.Panel>
      <Tabs.Panel value="camera-models">
        <CameraModelsSection />
      </Tabs.Panel>
      <Tabs.Panel value="cameras">
        <CamerasSection />
      </Tabs.Panel>
    </Tabs>
  );
}
