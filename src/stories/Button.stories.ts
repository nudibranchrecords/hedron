import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '../renderer/components/core/Button/Button'

const meta = {
  title: 'Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    children: 'Button',
  },
}

export const Secondary: Story = {
  args: {
    children: 'Button',
    type: 'secondary',
  },
}

export const Muted: Story = {
  args: {
    children: 'Button',
    type: 'neutral',
  },
}

export const WithIcon: Story = {
  args: {
    children: 'Copy Sketch',
    type: 'primary',
    iconName: 'content_copy',
  },
}

export const Danger: Story = {
  args: {
    children: 'Delete Sketch',
    type: 'danger',
    iconName: 'delete',
  },
}
