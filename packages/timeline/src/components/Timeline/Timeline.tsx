import { useCallback, useEffect, useRef, useState } from 'react'
import c from './Timeline.module.css'
import '@hedron-gl/ui-core/base.css'
import '@hedron-gl/ui-core/fonts.css'
import type { Timeline as TimelineData } from '@/types'

export interface TimelineProps {
  /** Timeline data */
  timeline: TimelineData
  /** Current playhead position in seconds */
  playheadPosition?: number
  /** Called when the user clicks on the track area to set the playhead */
  onPlayheadChange?: (time: number) => void
  /** Called when a keyframe should be deleted */
  onKeyframeDelete?: (keyframeId: string) => void
  /** Called when a keyframe should be inserted on a track at a given time */
  onKeyframeInsert?: (trackId: string, time: number) => void
}

export function Timeline({
  timeline,
  playheadPosition = 0,
  onPlayheadChange,
  onKeyframeDelete,
  onKeyframeInsert,
}: TimelineProps) {
  const { durationMs, tracks } = timeline
  const trackAreaRef = useRef<HTMLDivElement>(null)
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null)
  const [selectedKeyframe, setSelectedKeyframe] = useState<string | null>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'x' && selectedKeyframe) {
        onKeyframeDelete?.(selectedKeyframe)
        setSelectedKeyframe(null)
      }
      if (e.key === 'i' && selectedTrack) {
        onKeyframeInsert?.(selectedTrack, playheadPosition)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedKeyframe, onKeyframeDelete, selectedTrack, playheadPosition, onKeyframeInsert])

  const handleTrackClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!trackAreaRef.current || !onPlayheadChange) return
      const rect = trackAreaRef.current.getBoundingClientRect()
      const headerWidth = parseFloat(
        getComputedStyle(trackAreaRef.current).getPropertyValue('--trackHeaderWidth'),
      )
      const trackWidth = rect.width - headerWidth
      const x = e.clientX - rect.left - headerWidth
      if (x < 0) return
      const time = (x / trackWidth) * durationMs
      onPlayheadChange(Math.max(0, Math.min(durationMs, time)))
    },
    [durationMs, onPlayheadChange],
  )

  const playheadPercent = (playheadPosition / durationMs) * 100

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
          {(playheadPosition / 1000).toFixed(1)}s / {durationSec}s
        </span>
      </div>
      <div className={c.body} ref={trackAreaRef} onClick={handleTrackClick}>
        <div className={c.ruler}>{rulerMarks}</div>
        {tracks.map((track) => {
          const isSelected = selectedTrack === track.id
          return (
            <div key={track.id} className={`${c.track} ${isSelected ? c.trackSelected : ''}`}>
              <div className={c.trackHeader} onClick={() => setSelectedTrack(track.id)}>
                {track.label}
              </div>
              <div className={c.trackBody}>
                {track.keyframes.map((kf) => {
                  const percent = (kf.time / durationMs) * 100
                  const isKeyframeSelected = selectedKeyframe === kf.id
                  return (
                    <div
                      key={kf.id}
                      className={`${c.keyframe} ${isKeyframeSelected ? c.keyframeSelected : ''}`}
                      style={{ left: `${percent}%` }}
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedKeyframe(isKeyframeSelected ? null : kf.id)
                      }}
                    />
                  )
                })}
              </div>
            </div>
          )
        })}
        <div
          className={c.playhead}
          style={{ '--playheadPercent': playheadPercent / 100 } as React.CSSProperties}
        />
      </div>
    </div>
  )
}
