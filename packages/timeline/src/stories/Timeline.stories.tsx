import type { Meta, StoryObj } from '@storybook/react'
import { useState, useEffect, useCallback } from 'react'
import { Timeline } from '../Timeline'
import type { Keyframe } from '../Timeline'

const meta = {
  title: 'Timeline',
  component: Timeline,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100%', maxWidth: '800px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Timeline>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    duration: 10,
    playheadPosition: 0,
    keyframes: [],
  },
}

export const WithKeyframes: Story = {
  args: {
    duration: 10,
    playheadPosition: 3.5,
    keyframes: [
      { time: 1, value: 0.5 },
      { time: 3, value: 1.0 },
      { time: 5.5, value: 0.2 },
      { time: 8, value: 0.8 },
    ],
  },
}

export const Interactive = () => {
  const [playheadPosition, setPlayheadPosition] = useState(0)
  const [keyframes, setKeyframes] = useState<Keyframe[]>([
    { time: 1, value: 0.5 },
    { time: 4, value: 1.0 },
    { time: 7, value: 0.3 },
  ])

  const handleKeyframeClick = useCallback((index: number) => {
    setKeyframes((prev) => prev.filter((_, i) => i !== index))
  }, [])

  return (
    <div>
      <p style={{ color: '#aaa', fontSize: '12px', marginBottom: '8px' }}>
        Click the track to move the playhead. Click a keyframe to remove it.
      </p>
      <Timeline
        duration={10}
        playheadPosition={playheadPosition}
        keyframes={keyframes}
        onPlayheadChange={setPlayheadPosition}
        onKeyframeClick={handleKeyframeClick}
      />
    </div>
  )
}

export const Playing = () => {
  const [playheadPosition, setPlayheadPosition] = useState(0)
  const [playing, setPlaying] = useState(true)
  const duration = 10

  useEffect(() => {
    if (!playing) return
    const start = performance.now() - playheadPosition * 1000
    let raf: number
    const tick = (now: number) => {
      const elapsed = (now - start) / 1000
      setPlayheadPosition(elapsed % duration)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing, playheadPosition, duration])

  return (
    <div>
      <div style={{ marginBottom: '8px' }}>
        <button
          onClick={() => setPlaying(!playing)}
          style={{
            background: '#444',
            color: '#fff',
            border: 'none',
            padding: '4px 12px',
            borderRadius: '3px',
            cursor: 'pointer',
          }}
        >
          {playing ? 'Pause' : 'Play'}
        </button>
      </div>
      <Timeline
        duration={duration}
        playheadPosition={playheadPosition}
        keyframes={[
          { time: 0.5, value: 0 },
          { time: 2.5, value: 1 },
          { time: 5, value: 0.5 },
          { time: 7.5, value: 0.8 },
          { time: 9.5, value: 0.2 },
        ]}
        onPlayheadChange={(t) => {
          setPlayheadPosition(t)
          setPlaying(false)
        }}
      />
    </div>
  )
}

export const LongDuration: Story = {
  args: {
    duration: 120,
    playheadPosition: 45,
    keyframes: [
      { time: 10, value: 0.5 },
      { time: 30, value: 1.0 },
      { time: 60, value: 0.2 },
      { time: 90, value: 0.8 },
      { time: 110, value: 0.4 },
    ],
  },
}
