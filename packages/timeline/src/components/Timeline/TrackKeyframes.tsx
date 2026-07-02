import { Keyframe } from './Keyframe'
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
