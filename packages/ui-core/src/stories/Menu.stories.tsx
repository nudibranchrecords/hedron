import type { Meta } from '@storybook/react'
import { Menu, MenuItem } from '@components/Menu/Menu'
import { Icon } from '@components/Icon/Icon'

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
      <MenuItem>
        <Icon name="power" /> MIDI
      </MenuItem>
      <MenuItem>
        <Icon name="power" /> LFO
      </MenuItem>
      <MenuItem>
        <Icon name="power" /> Audio
      </MenuItem>
    </Menu>
  )
}
