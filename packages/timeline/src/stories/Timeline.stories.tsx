/* eslint-disable storybook/context-in-play-function */

import type { Meta, StoryObj } from '@storybook/react'
import { useState, useEffect, useRef, useCallback } from 'react'
// eslint-disable-next-line no-restricted-imports
import audioUrl from '../../../../apps/example-project/resources/120-4-4.mp3'
import { TimelineManager } from '@/TimelineManager'
import type { TrackValues } from '@/TimelineManager'
import { Timeline } from '@/components/Timeline/Timeline'
import type {
  KeyframeParam,
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

const STORY_COMPONENT_ID = 'timeline-story-component'

const NOOP_SET_SELECTED_TRACK_ID: (trackId: string | null) => void = () => {}
const NOOP_SET_ACTIVE_TIMELINE_COMPONENT_ID: (id: string | null) => void = () => {}
const NOOP_ON_PLAYHEAD_CHANGE: (time: number) => void = () => {}
const NOOP_ON_KEYFRAME_DELETE: (keyframeId: string) => void = () => {}
const NOOP_ON_KEYFRAME_INSERT: (trackId: string, time: number) => void = () => {}

const createInsertedKeyframe = (time: number, lastKeyframe?: KeyframeParam): KeyframeParam => {
  if (!lastKeyframe) {
    return {
      id: crypto.randomUUID(),
      time,
      nodeType: 'param',
      valueType: 'boolean',
      value: true,
    }
  }

  switch (lastKeyframe.valueType) {
    case 'number':
      return {
        id: crypto.randomUUID(),
        time,
        nodeType: 'param',
        valueType: 'number',
        value: typeof lastKeyframe.value === 'number' ? lastKeyframe.value : 0,
      }
    case 'boolean':
      return {
        id: crypto.randomUUID(),
        time,
        nodeType: 'param',
        valueType: 'boolean',
        value: typeof lastKeyframe.value === 'boolean' ? lastKeyframe.value : true,
      }
    case 'string':
      return {
        id: crypto.randomUUID(),
        time,
        nodeType: 'param',
        valueType: 'string',
        value: typeof lastKeyframe.value === 'string' ? lastKeyframe.value : '',
      }
    case 'file':
      return {
        id: crypto.randomUUID(),
        time,
        nodeType: 'param',
        valueType: 'file',
        value: typeof lastKeyframe.value === 'string' ? lastKeyframe.value : null,
      }
    case 'enum':
      return {
        id: crypto.randomUUID(),
        time,
        nodeType: 'param',
        valueType: 'enum',
        value: lastKeyframe.value,
      }
  }
}

const baseTimelineArgs = {
  activeTimelineComponentId: STORY_COMPONENT_ID,
  selectedTrackId: null,
  setSelectedTrackId: NOOP_SET_SELECTED_TRACK_ID,
  setActiveTimelineComponentId: NOOP_SET_ACTIVE_TIMELINE_COMPONENT_ID,
  componentId: STORY_COMPONENT_ID,
  onPlayheadChange: NOOP_ON_PLAYHEAD_CHANGE,
  onKeyframeDelete: NOOP_ON_KEYFRAME_DELETE,
  onKeyframeInsert: NOOP_ON_KEYFRAME_INSERT,
}

export const Default: Story = {
  args: {
    ...baseTimelineArgs,
    timeline: {
      durationMs: 10000,
      tracks: [],
    },
    playheadPositionMs: 0,
  },
}

export const WithKeyframes: Story = {
  args: {
    ...baseTimelineArgs,
    timeline: {
      durationMs: 10000,
      tracks: [
        {
          id: 'track-1',
          label: 'Visibility',
          trackType: 'keyframe',
          keyframes: [
            { id: 'kf-1', time: 1000, valueType: 'boolean', value: true, nodeType: 'param' },
            { id: 'kf-2', time: 3000, valueType: 'boolean', value: false, nodeType: 'param' },
            { id: 'kf-3', time: 5500, valueType: 'boolean', value: true, nodeType: 'param' },
            { id: 'kf-4', time: 8000, valueType: 'boolean', value: false, nodeType: 'param' },
          ],
        },
      ],
    },
    playheadPositionMs: 3500,
  },
}

export const WithVectorTrack: Story = {
  args: {
    ...baseTimelineArgs,
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
                { id: 'kf-px-1', time: 1000, valueType: 'number', value: 0, nodeType: 'param' },
                { id: 'kf-px-2', time: 5000, valueType: 'number', value: 0.75, nodeType: 'param' },
                { id: 'kf-px-3', time: 9000, valueType: 'number', value: -0.2, nodeType: 'param' },
              ],
            },
            {
              id: 'track-pos-y',
              label: 'Y',
              trackType: 'keyframe',
              keyframes: [
                { id: 'kf-py-1', time: 1500, valueType: 'number', value: -0.25, nodeType: 'param' },
                { id: 'kf-py-2', time: 4500, valueType: 'number', value: 0.5, nodeType: 'param' },
                { id: 'kf-py-3', time: 8000, valueType: 'number', value: 0.1, nodeType: 'param' },
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
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null)
  const [activeTimelineComponentId, setActiveTimelineComponentId] = useState<string | null>(
    STORY_COMPONENT_ID,
  )
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
              { id: 'kf-px1', time: 500, valueType: 'number', value: -0.5, nodeType: 'param' },
              { id: 'kf-px2', time: 4000, valueType: 'number', value: 0.35, nodeType: 'param' },
              { id: 'kf-px3', time: 7000, valueType: 'number', value: 0.8, nodeType: 'param' },
            ],
          },
          {
            id: 'track-pos-y',
            label: 'Y',
            trackType: 'keyframe',
            keyframes: [
              { id: 'kf-py1', time: 1000, valueType: 'number', value: 0.25, nodeType: 'param' },
              { id: 'kf-py2', time: 5000, valueType: 'number', value: -0.1, nodeType: 'param' },
              { id: 'kf-py3', time: 8500, valueType: 'number', value: 0.55, nodeType: 'param' },
            ],
          },
        ],
      },
      {
        id: 'track-1',
        label: 'Visibility',
        trackType: 'keyframe',
        keyframes: [
          { id: 'kf-v1', time: 0, valueType: 'boolean', value: true, nodeType: 'param' },
          { id: 'kf-v2', time: 3000, valueType: 'boolean', value: false, nodeType: 'param' },
          { id: 'kf-v3', time: 6000, valueType: 'boolean', value: true, nodeType: 'param' },
        ],
      },
      {
        id: 'track-2',
        label: 'Strobe',
        trackType: 'keyframe',
        keyframes: [
          { id: 'kf-s1', time: 1000, valueType: 'boolean', value: true, nodeType: 'param' },
          { id: 'kf-s2', time: 2000, valueType: 'boolean', value: false, nodeType: 'param' },
          { id: 'kf-s3', time: 4000, valueType: 'boolean', value: true, nodeType: 'param' },
          { id: 'kf-s4', time: 5000, valueType: 'boolean', value: false, nodeType: 'param' },
          { id: 'kf-s5', time: 7000, valueType: 'boolean', value: true, nodeType: 'param' },
          { id: 'kf-s6', time: 8000, valueType: 'boolean', value: false, nodeType: 'param' },
        ],
      },
      {
        id: 'track-3',
        label: 'Invert',
        trackType: 'keyframe',
        keyframes: [
          { id: 'kf-i1', time: 2500, valueType: 'boolean', value: true, nodeType: 'param' },
          { id: 'kf-i2', time: 7500, valueType: 'boolean', value: false, nodeType: 'param' },
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
            const lastKeyframe = track.keyframes[track.keyframes.length - 1] as KeyframeParam
            const insertedKeyframe = createInsertedKeyframe(time, lastKeyframe)

            return {
              ...track,
              keyframes: [...track.keyframes, insertedKeyframe].sort((a, b) => a.time - b.time),
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
        activeTimelineComponentId={activeTimelineComponentId}
        selectedTrackId={selectedTrackId}
        setSelectedTrackId={setSelectedTrackId}
        setActiveTimelineComponentId={setActiveTimelineComponentId}
        componentId={STORY_COMPONENT_ID}
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
    ...baseTimelineArgs,
    timeline: {
      durationMs: 120000,
      tracks: [
        {
          id: 'track-1',
          label: 'Active',
          trackType: 'keyframe',
          keyframes: [
            { id: 'kf-1', time: 10000, valueType: 'boolean', value: true, nodeType: 'param' },
            { id: 'kf-2', time: 30000, valueType: 'boolean', value: false, nodeType: 'param' },
            { id: 'kf-3', time: 60000, valueType: 'boolean', value: true, nodeType: 'param' },
            { id: 'kf-4', time: 90000, valueType: 'boolean', value: false, nodeType: 'param' },
            { id: 'kf-5', time: 110000, valueType: 'boolean', value: true, nodeType: 'param' },
          ],
        },
      ],
    },
    playheadPositionMs: 45000,
  },
}
