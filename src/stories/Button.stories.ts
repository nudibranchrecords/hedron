import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '../renderer/components/core/Button'

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
