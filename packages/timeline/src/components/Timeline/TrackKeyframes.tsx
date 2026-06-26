import { Keyframe } from './Keyframe'
import c from './Timeline.module.css'
import { TimelineManagerKeyframeTrack } from '@/types'

interface TrackKeyframesProps {
  track: TimelineManagerKeyframeTrack
  durationMs: number
  selectedKeyframes: string[] | null
  setSelectedKeyframes: (keyframeIds: string[] | null) => void
}

export const TrackKeyframes = ({
  track,
  durationMs,
  selectedKeyframes,
  setSelectedKeyframes,
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
      const isKeyframeSelected = selectedKeyframes?.includes(kf.id) ?? false
      return (
        <Keyframe
          key={kf.id}
          id={kf.id}
          percentPos={percent}
          isSelected={isKeyframeSelected}
          onClick={() => setSelectedKeyframes([kf.id])}
        />
      )
    })}
  </>
)
