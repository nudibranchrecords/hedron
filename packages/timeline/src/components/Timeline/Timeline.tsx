import { useCallback, useEffect, useRef, useState } from 'react'
import c from './Timeline.module.css'
import '@hedron-gl/ui-core/base.css'
import '@hedron-gl/ui-core/fonts.css'
import { TrackKeyframes } from './TrackKeyframes'
import { usePlayheadScrub } from './usePlayheadScrub'
import { Keyframe } from './Keyframe'
import { TimelineManagerKeyframeTrack, TimelineManagerTrack } from '@/types'

export interface TimelineProps {
  /** Timeline data */
  timeline: {
    durationMs: number
    tracks: TimelineManagerTrack[]
  }
  /** Current playhead position in milliseconds */
  playheadPositionMs?: number
  /** Called when the user clicks on the track area to set the playhead */
  onPlayheadChange?: (time: number) => void
  /** Called when a keyframe should be deleted */
  onKeyframeDelete?: (keyframeId: string) => void
  /** Called when a keyframe should be inserted on a track at a given time */
  onKeyframeInsert?: (trackId: string, time: number) => void
}

export function Timeline({
  timeline,
  playheadPositionMs = 0,
  onPlayheadChange,
  onKeyframeDelete,
  onKeyframeInsert,
}: TimelineProps) {
  const { durationMs, tracks } = timeline
  const rulerAreaRef = useRef<HTMLDivElement>(null)
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null)
  const [selectedKeyframes, setSelectedKeyframes] = useState<string[] | null>(null)

  const findTrackById = useCallback(
    (trackList: TimelineManagerTrack[], trackId: string): TimelineManagerTrack | null => {
      for (const track of trackList) {
        if (track.id === trackId) {
          return track
        }

        if (track.trackType === 'vector') {
          const childTrack = findTrackById(track.childTracks, trackId)
          if (childTrack) {
            return childTrack
          }
        }
      }

      return null
    },
    [],
  )

  useEffect(() => {
    const getChildKeyframeTrackIds = (track: TimelineManagerTrack): string[] => {
      if (track.trackType === 'keyframe') {
        return [track.id]
      }

      if (track.trackType === 'vector') {
        return track.childTracks.map((track) => track.id)
      }

      return []
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'x' && selectedKeyframes) {
        selectedKeyframes.forEach((keyframeId) => {
          onKeyframeDelete?.(keyframeId)
        })

        setSelectedKeyframes(null)
      }
      if (e.key === 'i' && selectedTrack) {
        if (!onKeyframeInsert) return

        const track = findTrackById(tracks, selectedTrack)
        if (!track) return

        for (const keyframeTrackId of getChildKeyframeTrackIds(track)) {
          console.log(`Inserting keyframe on track ${keyframeTrackId} at ${playheadPositionMs}ms`)
          onKeyframeInsert(keyframeTrackId, playheadPositionMs)
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    selectedKeyframes,
    onKeyframeDelete,
    selectedTrack,
    playheadPositionMs,
    onKeyframeInsert,
    tracks,
    findTrackById,
  ])

  usePlayheadScrub(durationMs, rulerAreaRef, playheadPositionMs, onPlayheadChange)

  const playheadPercent = (playheadPositionMs / durationMs) * 100

  const durationSec = durationMs / 1000
  const rulerMarks = []
  const step = durationSec <= 10 ? 1 : durationSec <= 60 ? 5 : 10
  for (let t = 0; t <= durationSec; t += step) {
    const percent = (t / durationSec) * 100
    rulerMarks.push(
      <div key={t} className={c.rulerMark} style={{ left: `${percent}%` }}>
        <span className={c.rulerLabel}>{t}s</span>
      </div>,
    )
  }

  const getChildKeyframeTimes = (track: TimelineManagerTrack): number[] => {
    if (track.trackType === 'keyframe') {
      return track.keyframes.map((kf) => kf.time)
    }

    if (track.trackType === 'vector') {
      const times = track.childTracks.flatMap((childTrack) =>
        childTrack.keyframes.map((kf) => kf.time),
      )
      return Array.from(new Set(times)).sort((a, b) => a - b)
    }

    return []
  }

  const getKeyframesAtTime = (tracks: TimelineManagerKeyframeTrack[], time: number): string[] => {
    const keyframeIds: string[] = []

    for (const track of tracks) {
      const kf = track.keyframes.find((kf) => kf.time === time)
      if (kf) {
        keyframeIds.push(kf.id)
      }
    }

    return keyframeIds
  }

  const renderTracks = (trackList: TimelineManagerTrack[], depth = 0): React.ReactNode[] => {
    return trackList.flatMap((track) => {
      const isSelected = selectedTrack === track.id

      const row = (
        <div key={track.id} className={`${c.track} ${isSelected ? c.trackSelected : ''}`}>
          <div
            className={c.trackHeader}
            style={{ paddingLeft: `${16 + depth * 16}px` }}
            onClick={() => setSelectedTrack(track.id)}
          >
            {track.label}
          </div>
          <div className={c.trackBody}>
            {track.trackType === 'keyframe' && (
              <TrackKeyframes
                track={track}
                durationMs={durationMs}
                selectedKeyframes={selectedKeyframes}
                setSelectedKeyframes={setSelectedKeyframes}
              />
            )}
            {track.trackType === 'vector' &&
              getChildKeyframeTimes(track).map((time, index) => {
                const percent = (time / durationMs) * 100

                const isSelected = !getKeyframesAtTime(track.childTracks, time).some(
                  (kfId) => !selectedKeyframes?.includes(kfId),
                )

                return (
                  <Keyframe
                    key={index}
                    id={index.toString()}
                    percentPos={percent}
                    isSelected={isSelected}
                    onClick={() => {
                      setSelectedKeyframes(getKeyframesAtTime(track.childTracks, time))
                    }}
                  />
                )
              })}
          </div>
        </div>
      )

      if (track.trackType !== 'vector') {
        return [row]
      }

      return [row, ...renderTracks(track.childTracks, depth + 1)]
    })
  }

  return (
    <div className={c.timeline}>
      <div className={c.header}>
        <span>Timeline</span>
        <span>
          {(playheadPositionMs / 1000).toFixed(1)}s / {durationSec}s
        </span>
      </div>
      <div className={c.body}>
        <div className={c.ruler} ref={rulerAreaRef}>
          {rulerMarks}
        </div>
        {renderTracks(tracks)}
        <div
          className={c.playhead}
          style={{ '--playheadPercent': playheadPercent / 100 } as React.CSSProperties}
        />
      </div>
    </div>
  )
}
