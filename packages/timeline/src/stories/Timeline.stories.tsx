/* eslint-disable storybook/context-in-play-function */

import type { Meta, StoryObj } from '@storybook/react'
import { useState, useEffect, useRef, useCallback } from 'react'
// eslint-disable-next-line no-restricted-imports
import audioUrl from '../../../../apps/example-project/resources/120-4-4.mp3'
import { TimelineManager } from '@/TimelineManager'
import type { TrackValues } from '@/TimelineManager'
import { Timeline } from '@/components/Timeline/Timeline'
import type {
  TimelineManagerData,
  TimelineManagerKeyframeTrack,
  TimelineManagerTrack,
} from '@/types'

import '@hedron-gl/ui-core/icons.css'
import '@hedron-gl/ui-core/base.css'
import '@hedron-gl/ui-core/fonts.css'

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
    playheadPositionMs: 0,
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
          trackType: 'keyframe',
          keyframes: [
            { id: 'kf-1', time: 1000, valueType: 'boolean', value: true },
            { id: 'kf-2', time: 3000, valueType: 'boolean', value: false },
            { id: 'kf-3', time: 5500, valueType: 'boolean', value: true },
            { id: 'kf-4', time: 8000, valueType: 'boolean', value: false },
          ],
        },
      ],
    },
    playheadPositionMs: 3500,
  },
}

export const WithVectorTrack: Story = {
  args: {
    timeline: {
      durationMs: 10000,
      tracks: [
        {
          id: 'track-pos',
          label: 'Position',
          trackType: 'vector',
          childTracks: [
            {
              id: 'track-pos-x',
              label: 'X',
              trackType: 'keyframe',
              keyframes: [
                { id: 'kf-px-1', time: 1000, valueType: 'number', value: 0 },
                { id: 'kf-px-2', time: 5000, valueType: 'number', value: 0.75 },
                { id: 'kf-px-3', time: 9000, valueType: 'number', value: -0.2 },
              ],
            },
            {
              id: 'track-pos-y',
              label: 'Y',
              trackType: 'keyframe',
              keyframes: [
                { id: 'kf-py-1', time: 1500, valueType: 'number', value: -0.25 },
                { id: 'kf-py-2', time: 4500, valueType: 'number', value: 0.5 },
                { id: 'kf-py-3', time: 8000, valueType: 'number', value: 0.1 },
              ],
            },
          ],
        },
      ],
    },
    playheadPositionMs: 4200,
  },
}

export const Interactive = () => {
  const [playheadPositionMs, setPlayheadPositionMs] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [trackValues, setTrackValues] = useState<TrackValues>({})
  const [timeline, setTimeline] = useState<TimelineManagerData>({
    durationMs: 10000,
    tracks: [
      {
        id: 'track-audio',
        label: 'test.mp3',
        trackType: 'audio',
        audioUrl: audioUrl,
      },
      {
        id: 'track-pos',
        label: 'Position',
        trackType: 'vector',
        childTracks: [
          {
            id: 'track-pos-x',
            label: 'X',
            trackType: 'keyframe',
            keyframes: [
              { id: 'kf-px1', time: 500, valueType: 'number', value: -0.5 },
              { id: 'kf-px2', time: 4000, valueType: 'number', value: 0.35 },
              { id: 'kf-px3', time: 7000, valueType: 'number', value: 0.8 },
            ],
          },
          {
            id: 'track-pos-y',
            label: 'Y',
            trackType: 'keyframe',
            keyframes: [
              { id: 'kf-py1', time: 1000, valueType: 'number', value: 0.25 },
              { id: 'kf-py2', time: 5000, valueType: 'number', value: -0.1 },
              { id: 'kf-py3', time: 8500, valueType: 'number', value: 0.55 },
            ],
          },
        ],
      },
      {
        id: 'track-1',
        label: 'Visibility',
        trackType: 'keyframe',
        keyframes: [
          { id: 'kf-v1', time: 0, valueType: 'boolean', value: true },
          { id: 'kf-v2', time: 3000, valueType: 'boolean', value: false },
          { id: 'kf-v3', time: 6000, valueType: 'boolean', value: true },
        ],
      },
      {
        id: 'track-2',
        label: 'Strobe',
        trackType: 'keyframe',
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
        trackType: 'keyframe',
        keyframes: [
          { id: 'kf-i1', time: 2500, valueType: 'boolean', value: true },
          { id: 'kf-i2', time: 7500, valueType: 'boolean', value: false },
        ],
      },
    ],
  })

  const managerRef = useRef<TimelineManager | null>(null)

  useEffect(() => {
    const manager = new TimelineManager({
      durationMs: 10000,
      tracks: [],
    })
    managerRef.current = manager
  }, [])

  useEffect(() => {
    const manager = managerRef.current
    if (!manager) return

    manager.onUpdate((changed) => {
      setTrackValues((prev) => ({ ...prev, ...changed }))
      setPlayheadPositionMs(manager.getPosition())
    })

    return () => manager.dispose()
  }, [timeline])

  useEffect(() => {
    managerRef.current?.setTracks(timeline.tracks)
  }, [timeline])

  const handlePlayPause = () => {
    const manager = managerRef.current
    if (!manager) return
    if (playing) {
      manager.pause()
    } else {
      manager.play()
    }
    setPlaying(!playing)
  }

  const handlePlayheadChange = useCallback((time: number) => {
    managerRef.current?.goTo(time)
    setPlayheadPositionMs(time)
    setPlaying(false)
    managerRef.current?.pause()
  }, [])

  const handleKeyframeDelete = useCallback((keyframeId: string) => {
    setTimeline((prev) => ({
      ...prev,
      tracks: prev.tracks.map((track) => {
        const deleteKeyframes = (track: TimelineManagerTrack): TimelineManagerTrack => {
          if (track.trackType === 'keyframe') {
            return {
              ...track,
              keyframes: track.keyframes.filter((kf) => kf.id !== keyframeId),
            }
          }
          if (track.trackType === 'vector') {
            return {
              ...track,
              childTracks: track.childTracks.map(deleteKeyframes) as TimelineManagerKeyframeTrack[],
            }
          }
          return track
        }

        return deleteKeyframes(track)
      }),
    }))
  }, [])

  const handleKeyframeInsert = useCallback((trackId: string, time: number) => {
    setTimeline((prev) => ({
      ...prev,
      tracks: prev.tracks.map((track) => {
        const insertKeyframe = (track: TimelineManagerTrack): TimelineManagerTrack => {
          if (track.trackType === 'keyframe' && track.id === trackId) {
            const lastKeyframe = track.keyframes[track.keyframes.length - 1]
            const valueType = lastKeyframe?.valueType ?? 'boolean'
            const value =
              lastKeyframe?.value ??
              (valueType === 'number' ? 0 : valueType === 'boolean' ? true : null)

            return {
              ...track,
              keyframes: [
                ...track.keyframes,
                {
                  id: crypto.randomUUID(),
                  time,
                  valueType,
                  value,
                },
              ].sort((a, b) => a.time - b.time),
            }
          }
          if (track.trackType === 'vector') {
            return {
              ...track,
              childTracks: track.childTracks.map(
                insertKeyframe as (track: TimelineManagerTrack) => TimelineManagerKeyframeTrack,
              ),
            }
          }
          return track
        }

        return insertKeyframe(track)
      }),
    }))
  }, [])

  const getKeyframeTracks = (tracks: TimelineManagerTrack[]): TimelineManagerTrack[] => {
    return tracks.flatMap((track) => {
      if (track.trackType === 'keyframe') {
        return [track]
      }

      if (track.trackType === 'vector') {
        return getKeyframeTracks(track.childTracks)
      }

      return [track]
    })
  }

  return (
    <div>
      <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={handlePlayPause}
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
        <span style={{ color: '#aaa', fontSize: '12px' }}>
          Click a track header to select it. Press &quot;i&quot; to insert a keyframe at the
          playhead. Click a keyframe to select it, then press &quot;x&quot; to delete.
        </span>
      </div>
      <Timeline
        timeline={timeline}
        playheadPositionMs={playheadPositionMs}
        onPlayheadChange={handlePlayheadChange}
        onKeyframeDelete={handleKeyframeDelete}
        onKeyframeInsert={handleKeyframeInsert}
      />
      <div style={{ marginTop: '12px', fontFamily: 'monospace', fontSize: '12px', color: '#ccc' }}>
        <div style={{ marginBottom: '4px', color: '#888' }}>Track Values:</div>
        {getKeyframeTracks(timeline.tracks).map((track) => {
          const value = trackValues[track.id]
          const valueColor = typeof value === 'boolean' ? (value ? '#4f4' : '#f44') : '#7cc5ff'

          return (
            <div key={track.id} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ color: '#888' }}>{track.label}:</span>
              <span style={{ color: valueColor }}>{String(value ?? false)}</span>
            </div>
          )
        })}
      </div>
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
          trackType: 'keyframe',
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
    playheadPositionMs: 45000,
  },
}
