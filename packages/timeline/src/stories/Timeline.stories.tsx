import type { Meta, StoryObj } from '@storybook/react'
import { useState, useEffect } from 'react'
import { Timeline } from '@components/Timeline/Timeline'
import type { Timeline as TimelineData } from '@types'

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
            { id: 'kf-1', time: 1000, valueType: 'boolean', value: true },
            { id: 'kf-2', time: 3000, valueType: 'boolean', value: false },
            { id: 'kf-3', time: 5500, valueType: 'boolean', value: true },
            { id: 'kf-4', time: 8000, valueType: 'boolean', value: false },
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
          { id: 'kf-1', time: 1000, valueType: 'boolean', value: true },
          { id: 'kf-2', time: 4000, valueType: 'boolean', value: false },
          { id: 'kf-3', time: 7000, valueType: 'boolean', value: true },
        ],
      },
    ],
  })

  const handleKeyframeDelete = (keyframeId: string) => {
    setTimeline((prev) => ({
      ...prev,
      tracks: prev.tracks.map((track) => ({
        ...track,
        keyframes: track.keyframes.filter((kf) => kf.id !== keyframeId),
      })),
    }))
  }

  const handleKeyframeInsert = (trackId: string, time: number) => {
    setTimeline((prev) => ({
      ...prev,
      tracks: prev.tracks.map((track) =>
        track.id === trackId
          ? {
              ...track,
              keyframes: [
                ...track.keyframes,
                { id: `kf-${Date.now()}`, time, valueType: 'boolean' as const, value: true },
              ].sort((a, b) => a.time - b.time),
            }
          : track,
      ),
    }))
  }

  return (
    <div>
      <p style={{ color: '#aaa', fontSize: '12px', marginBottom: '8px' }}>
        Click a track header to select it. Press &quot;i&quot; to insert a keyframe at the playhead.
        Click a keyframe to select it, then press &quot;x&quot; to delete.
      </p>
      <Timeline
        timeline={timeline}
        playheadPosition={playheadPosition}
        onPlayheadChange={setPlayheadPosition}
        onKeyframeDelete={handleKeyframeDelete}
        onKeyframeInsert={handleKeyframeInsert}
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
                { id: 'kf-1', time: 500, valueType: 'boolean', value: true },
                { id: 'kf-2', time: 2500, valueType: 'boolean', value: false },
                { id: 'kf-3', time: 5000, valueType: 'boolean', value: true },
                { id: 'kf-4', time: 7500, valueType: 'boolean', value: false },
                { id: 'kf-5', time: 9500, valueType: 'boolean', value: true },
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
            { id: 'kf-1', time: 10000, valueType: 'boolean', value: true },
            { id: 'kf-2', time: 30000, valueType: 'boolean', value: false },
            { id: 'kf-3', time: 60000, valueType: 'boolean', value: true },
            { id: 'kf-4', time: 90000, valueType: 'boolean', value: false },
            { id: 'kf-5', time: 110000, valueType: 'boolean', value: true },
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
            { id: 'kf-v1', time: 0, valueType: 'boolean', value: true },
            { id: 'kf-v2', time: 3000, valueType: 'boolean', value: false },
            { id: 'kf-v3', time: 6000, valueType: 'boolean', value: true },
          ],
        },
        {
          id: 'track-2',
          label: 'Strobe',
          keyframes: [
            { id: 'kf-s1', time: 1000, valueType: 'boolean', value: true },
            { id: 'kf-s2', time: 2000, valueType: 'boolean', value: false },
            { id: 'kf-s3', time: 4000, valueType: 'boolean', value: true },
            { id: 'kf-s4', time: 5000, valueType: 'boolean', value: false },
            { id: 'kf-s5', time: 7000, valueType: 'boolean', value: true },
            { id: 'kf-s6', time: 8000, valueType: 'boolean', value: false },
          ],
        },
        {
          id: 'track-3',
          label: 'Invert',
          keyframes: [
            { id: 'kf-i1', time: 2500, valueType: 'boolean', value: true },
            { id: 'kf-i2', time: 7500, valueType: 'boolean', value: false },
          ],
        },
      ],
    },
    playheadPosition: 4000,
  },
}
