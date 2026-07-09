import { useCallback, useEffect, useRef, useState } from 'react'
import { usePlayheadScrub } from './usePlayheadScrub'
import c from './Timeline.module.css'
import { TimelineTrack } from './TimelineTrack'
import { TimelineManagerTrack } from '@/types'

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
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null)
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
      const target = e.target as HTMLElement | null
      if (target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable) {
        return
      }
      if (e.key === 'x' && selectedKeyframes) {
        selectedKeyframes.forEach((keyframeId) => {
          onKeyframeDelete?.(keyframeId)
        })

        setSelectedKeyframes(null)
      }
      if (e.key === 'i' && selectedTrackId) {
        if (!onKeyframeInsert) return

        const track = findTrackById(tracks, selectedTrackId)
        if (!track) return

        for (const keyframeTrackId of getChildKeyframeTrackIds(track)) {
          onKeyframeInsert(keyframeTrackId, playheadPositionMs)
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    selectedKeyframes,
    onKeyframeDelete,
    selectedTrackId,
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
        {tracks.map((track) => (
          <TimelineTrack
            key={track.id}
            selectedTrackId={selectedTrackId}
            setSelectedTrackId={setSelectedTrackId}
            track={track}
            depth={0}
            durationMs={durationMs}
            selectedKeyframes={selectedKeyframes}
            setSelectedKeyframes={setSelectedKeyframes}
          />
        ))}
        <div
          className={c.playhead}
          style={{ '--playheadPercent': playheadPercent / 100 } as React.CSSProperties}
        />
      </div>
    </div>
  )
}
