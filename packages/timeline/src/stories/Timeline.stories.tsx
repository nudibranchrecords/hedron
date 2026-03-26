import type { Meta, StoryObj } from '@storybook/react'
import { useState, useEffect, useCallback } from 'react'
import { Timeline } from '@components/Timeline'
import type { Timeline as TimelineData } from '@components/types'

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
    timeline: {
      durationMs: 10000,
      tracks: [],
    },
    playheadPosition: 0,
  },
}

export const WithKeyframes: Story = {
  args: {
    timeline: {
      durationMs: 10000,
      tracks: [
        {
          id: 'track-1',
          label: 'Visibility',
          keyframes: [
            { time: 1000, valueType: 'boolean', value: true },
            { time: 3000, valueType: 'boolean', value: false },
            { time: 5500, valueType: 'boolean', value: true },
            { time: 8000, valueType: 'boolean', value: false },
          ],
        },
      ],
    },
    playheadPosition: 3500,
  },
}

export const Interactive = () => {
  const [playheadPosition, setPlayheadPosition] = useState(0)
  const [timeline, setTimeline] = useState<TimelineData>({
    durationMs: 10000,
    tracks: [
      {
        id: 'track-1',
        label: 'Visibility',
        keyframes: [
          { time: 1000, valueType: 'boolean', value: true },
          { time: 4000, valueType: 'boolean', value: false },
          { time: 7000, valueType: 'boolean', value: true },
        ],
      },
    ],
  })

  const handleKeyframeClick = useCallback((trackId: string, keyframeIndex: number) => {
    setTimeline((prev) => ({
      ...prev,
      tracks: prev.tracks.map((track) =>
        track.id === trackId
          ? { ...track, keyframes: track.keyframes.filter((_, i) => i !== keyframeIndex) }
          : track,
      ),
    }))
  }, [])

  return (
    <div>
      <p style={{ color: '#aaa', fontSize: '12px', marginBottom: '8px' }}>
        Click the track to move the playhead. Click a keyframe to remove it.
      </p>
      <Timeline
        timeline={timeline}
        playheadPosition={playheadPosition}
        onPlayheadChange={setPlayheadPosition}
        onKeyframeClick={handleKeyframeClick}
      />
    </div>
  )
}

export const Playing = () => {
  const [playheadPosition, setPlayheadPosition] = useState(0)
  const [playing, setPlaying] = useState(true)
  const durationMs = 10000

  useEffect(() => {
    if (!playing) return
    const start = performance.now() - playheadPosition
    let raf: number
    const tick = (now: number) => {
      const elapsed = now - start
      setPlayheadPosition(elapsed % durationMs)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing, playheadPosition, durationMs])

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
        timeline={{
          durationMs,
          tracks: [
            {
              id: 'track-1',
              label: 'Enabled',
              keyframes: [
                { time: 500, valueType: 'boolean', value: true },
                { time: 2500, valueType: 'boolean', value: false },
                { time: 5000, valueType: 'boolean', value: true },
                { time: 7500, valueType: 'boolean', value: false },
                { time: 9500, valueType: 'boolean', value: true },
              ],
            },
          ],
        }}
        playheadPosition={playheadPosition}
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
    timeline: {
      durationMs: 120000,
      tracks: [
        {
          id: 'track-1',
          label: 'Active',
          keyframes: [
            { time: 10000, valueType: 'boolean', value: true },
            { time: 30000, valueType: 'boolean', value: false },
            { time: 60000, valueType: 'boolean', value: true },
            { time: 90000, valueType: 'boolean', value: false },
            { time: 110000, valueType: 'boolean', value: true },
          ],
        },
      ],
    },
    playheadPosition: 45000,
  },
}

export const MultipleTracks: Story = {
  args: {
    timeline: {
      durationMs: 10000,
      tracks: [
        {
          id: 'track-1',
          label: 'Visibility',
          keyframes: [
            { time: 0, valueType: 'boolean', value: true },
            { time: 3000, valueType: 'boolean', value: false },
            { time: 6000, valueType: 'boolean', value: true },
          ],
        },
        {
          id: 'track-2',
          label: 'Strobe',
          keyframes: [
            { time: 1000, valueType: 'boolean', value: true },
            { time: 2000, valueType: 'boolean', value: false },
            { time: 4000, valueType: 'boolean', value: true },
            { time: 5000, valueType: 'boolean', value: false },
            { time: 7000, valueType: 'boolean', value: true },
            { time: 8000, valueType: 'boolean', value: false },
          ],
        },
        {
          id: 'track-3',
          label: 'Invert',
          keyframes: [
            { time: 2500, valueType: 'boolean', value: true },
            { time: 7500, valueType: 'boolean', value: false },
          ],
        },
      ],
    },
    playheadPosition: 4000,
  },
}
