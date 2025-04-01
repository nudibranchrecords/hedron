import type { Meta } from '@storybook/react'
import { Menu, MenuItem } from '@components/Menu/Menu'

const meta = {
  title: 'Menu',
  component: Menu,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Menu>

export default meta

export const Default = () => {
  return (
    <Menu>
      <MenuItem>MIDI</MenuItem>
      <MenuItem>LFO</MenuItem>
      <MenuItem>Audio</MenuItem>
    </Menu>
  )
}
