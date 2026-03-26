import { useCallback, useRef } from 'react'
import c from './Timeline.module.css'
import '@hedron-gl/ui-core/base.css'
import '@hedron-gl/ui-core/fonts.css'
import type { Timeline as TimelineData } from './types'

export interface TimelineProps {
  /** Timeline data */
  timeline: TimelineData
  /** Current playhead position in seconds */
  playheadPosition?: number
  /** Called when the user clicks on the track area to set the playhead */
  onPlayheadChange?: (time: number) => void
  /** Called when a keyframe is clicked */
  onKeyframeClick?: (trackId: string, keyframeIndex: number) => void
}

export function Timeline({
  timeline,
  playheadPosition = 0,
  onPlayheadChange,
  onKeyframeClick,
}: TimelineProps) {
  const { durationMs, tracks } = timeline
  const trackAreaRef = useRef<HTMLDivElement>(null)

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
        {tracks.map((track) => (
          <>
            <div key={`h-${track.id}`} className={c.trackHeader}>
              {track.label}
            </div>
            <div key={`b-${track.id}`} className={c.trackBody}>
              {track.keyframes.map((kf, i) => {
                const percent = (kf.time / durationMs) * 100
                return (
                  <div
                    key={i}
                    className={c.keyframe}
                    style={{ left: `${percent}%` }}
                    onClick={(e) => {
                      e.stopPropagation()
                      onKeyframeClick?.(track.id, i)
                    }}
                  />
                )
              })}
            </div>
          </>
        ))}
        <div
          className={c.playhead}
          style={{ '--playheadPercent': playheadPercent / 100 } as React.CSSProperties}
        />
      </div>
    </div>
  )
}
