import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { ClockDisplay } from '@components/ClockDisplay/ClockDisplay'

const meta = {
  title: 'ClockDisplay',
  component: ClockDisplay,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ClockDisplay>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    bpm: 120,
    beat: 1,
    isRunning: false,
    onBpmEdit: fn(),
    onStartClick: fn(),
    onStopClick: fn(),
    onTapClick: fn(),
    onResetClick: fn(),
  },
}

export const Running: Story = {
  args: {
    bpm: 120,
    beat: 1,
    isRunning: true,
    onBpmEdit: fn(),
    onStartClick: fn(),
    onStopClick: fn(),
    onTapClick: fn(),
    onResetClick: fn(),
  },
}

export const LowBPM: Story = {
  args: {
    bpm: 60,
    beat: 1,
    isRunning: false,
    onBpmEdit: fn(),
    onStartClick: fn(),
    onStopClick: fn(),
    onTapClick: fn(),
    onResetClick: fn(),
  },
}
