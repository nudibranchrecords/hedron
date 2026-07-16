import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { usePlayheadScrub } from './usePlayheadScrub'
import c from './Timeline.module.css'
import { TimelineTrack } from './TimelineTrack'
import { TimelineManagerTrack } from '@/types'
import { findTrackById } from '@/utils/findTrackById'

export interface TimelineProps {
  /** Timeline data */
  timeline: {
    durationMs: number
    tracks: TimelineManagerTrack[]
  }
  playheadPositionMs: number
  activeTimelineComponentId: string | null
  selectedTrackId: string | null
  setSelectedTrackId: (trackId: string | null) => void
  setActiveTimelineComponentId: (id: string | null) => void
  componentId?: string
  onPlayheadChange: (time: number) => void
  onKeyframeDelete: (keyframeId: string) => void
  onKeyframeInsert: (trackId: string, time: number) => void
}

export function Timeline({
  timeline,
  playheadPositionMs = 0,
  activeTimelineComponentId,
  selectedTrackId: _selectedTrackId,
  setSelectedTrackId: _setSelectedTrackId,
  componentId: _componentId,
  setActiveTimelineComponentId,
  onPlayheadChange,
  onKeyframeDelete,
  onKeyframeInsert,
}: TimelineProps) {
  const { durationMs, tracks } = timeline
  const rulerAreaRef = useRef<HTMLDivElement>(null)

  // To prevent clashing of keyboard events, we need to keep track of which component is the active one
  const fallbackId = useId()
  const componentId = _componentId ?? fallbackId

  const isActiveComponent = componentId === activeTimelineComponentId

  const [_selectedKeyframes, _setSelectedKeyframes] = useState<string[] | null>(null)

  const selectedKeyframes = isActiveComponent ? _selectedKeyframes : null
  const selectedTrackId = isActiveComponent ? _selectedTrackId : null

  const setSelectedKeyframes = useCallback(
    (keyframes: string[] | null) => {
      _setSelectedKeyframes(keyframes)

      setActiveTimelineComponentId(componentId)
    },
    [componentId, setActiveTimelineComponentId],
  )

  const setSelectedTrackId = useCallback(
    (trackId: string | null) => {
      _setSelectedTrackId(trackId)

      setActiveTimelineComponentId(componentId)
    },
    [_setSelectedTrackId, componentId, setActiveTimelineComponentId],
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
      if (
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable
      ) {
        return
      }
      if (e.key === 'x' && selectedKeyframes) {
        selectedKeyframes.forEach((keyframeId) => {
          onKeyframeDelete(keyframeId)
        })

        setSelectedKeyframes(null)
      }
      if (e.key === 'i' && selectedTrackId) {
        const track = findTrackById(tracks, selectedTrackId)
        if (!track) return

        for (const keyframeTrackId of getChildKeyframeTrackIds(track)) {
          onKeyframeInsert(keyframeTrackId, playheadPositionMs)
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [
    selectedKeyframes,
    onKeyframeDelete,
    selectedTrackId,
    playheadPositionMs,
    onKeyframeInsert,
    tracks,
    setSelectedKeyframes,
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
