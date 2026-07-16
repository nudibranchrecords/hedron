import type { Meta, StoryObj } from '@storybook/react'
import {
  ParamPresetsControl,
  ParamPresetItem,
} from '../components/ParamPresetsControl/ParamPresetsControl'

const defaultPresets: ParamPresetItem[] = [
  { id: 'preset-1', name: 'Bright Pulse' },
  { id: 'preset-2', name: 'Fog Drift' },
  { id: 'preset-3', name: 'Soft Bloom' },
]

const meta: Meta<typeof ParamPresetsControl> = {
  title: 'ParamPresets/Control',
  component: ParamPresetsControl,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100%', maxWidth: '500px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    presets: defaultPresets,
    onPresetSelect: () => {},
    onPresetSave: () => {},
    onPresetDelete: () => {},
    onPresetOverwrite: () => {},
    onPresetEditTitle: (_id: string, _newName: string) => {},
  },
}

export const Empty: Story = {
  args: {
    presets: [],
    onPresetSelect: () => {},
    onPresetSave: () => {},
    onPresetDelete: () => {},
    onPresetOverwrite: () => {},
    onPresetEditTitle: (_id: string, _newName: string) => {},
  },
}
