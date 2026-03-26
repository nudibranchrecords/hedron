import { useCallback, useRef } from 'react'
import styles from './Timeline.module.css'

export interface Keyframe {
  time: number
  value: number
}

export interface TimelineProps {
  /** Total duration in seconds */
  duration?: number
  /** Current playhead position in seconds */
  playheadPosition?: number
  /** Keyframes to display on the timeline */
  keyframes?: Keyframe[]
  /** Called when the user clicks on the track area to set the playhead */
  onPlayheadChange?: (time: number) => void
  /** Called when a keyframe is clicked */
  onKeyframeClick?: (index: number) => void
}

export function Timeline({
  duration = 10,
  playheadPosition = 0,
  keyframes = [],
  onPlayheadChange,
  onKeyframeClick,
}: TimelineProps) {
  const trackAreaRef = useRef<HTMLDivElement>(null)

  const handleTrackClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!trackAreaRef.current || !onPlayheadChange) return
      const rect = trackAreaRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const time = (x / rect.width) * duration
      onPlayheadChange(Math.max(0, Math.min(duration, time)))
    },
    [duration, onPlayheadChange],
  )

  const playheadPercent = (playheadPosition / duration) * 100

  const rulerMarks = []
  const step = duration <= 10 ? 1 : duration <= 60 ? 5 : 10
  for (let t = 0; t <= duration; t += step) {
    const percent = (t / duration) * 100
    rulerMarks.push(
      <div key={t} className={styles.rulerMark} style={{ left: `${percent}%` }}>
        <span className={styles.rulerLabel}>{t}s</span>
      </div>,
    )
  }

  return (
    <div className={styles.timeline}>
      <div className={styles.header}>
        <span>Timeline</span>
        <span>
          {playheadPosition.toFixed(1)}s / {duration}s
        </span>
      </div>
      <div className={styles.trackArea} ref={trackAreaRef} onClick={handleTrackClick}>
        <div className={styles.ruler}>{rulerMarks}</div>
        <div className={styles.keyframeTrack}>
          {keyframes.map((kf, i) => {
            const percent = (kf.time / duration) * 100
            return (
              <div
                key={i}
                className={styles.keyframe}
                style={{ left: `${percent}%` }}
                onClick={(e) => {
                  e.stopPropagation()
                  onKeyframeClick?.(i)
                }}
              />
            )
          })}
        </div>
        <div className={styles.playhead} style={{ left: `${playheadPercent}%` }} />
      </div>
    </div>
  )
}
