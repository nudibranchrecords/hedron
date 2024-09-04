import type { Meta, StoryObj } from '@storybook/react'
import { NodeControl } from '../renderer/components/core/NodeControl/NodeControl'

const meta = {
  title: 'NodeControl',
  component: NodeControl,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof NodeControl>

export default meta
type Story = StoryObj<typeof meta>

export const Simple: Story = {
  args: {
    title: 'Test Param',
  },
}

export const Active: Story = {
  args: {
    title: 'Test Param',
    isActive: true,
  },
}
