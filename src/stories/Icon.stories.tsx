import type { Meta, StoryObj } from '@storybook/react'
import { Icon } from '../renderer/components/core/Icon/Icon'

const meta = {
  title: 'Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
    name: 'add',
  },
}
