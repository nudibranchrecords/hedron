import c from './Timeline.module.css'
import { TimelineManagerKeyframeTrack } from '@/types'

interface TrackKeyframesProps {
  track: TimelineManagerKeyframeTrack
  durationMs: number
  selectedKeyframe: string | null
  setSelectedKeyframe: (keyframeId: string | null) => void
}

export const TrackKeyframes = ({
  track,
  durationMs,
  selectedKeyframe,
  setSelectedKeyframe,
}: TrackKeyframesProps) => (
  <>
    {track.keyframes.map((kf, i) => {
      if (!kf.value) return null
      const startPercent = (kf.time / durationMs) * 100
      const nextKf = track.keyframes[i + 1]
      const endPercent = nextKf ? (nextKf.time / durationMs) * 100 : 100
      return (
        <div
          key={`region-${kf.id}`}
          className={c.activeRegion}
          style={{ left: `${startPercent}%`, width: `${endPercent - startPercent}%` }}
        />
      )
    })}
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
  </>
)
