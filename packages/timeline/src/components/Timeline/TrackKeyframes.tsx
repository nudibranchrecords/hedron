import { RefObject } from 'react'
import { Keyframe } from './Keyframe'
import { TimelineManagerKeyframeTrack } from '@/types'

interface TrackKeyframesProps {
  track: TimelineManagerKeyframeTrack
  durationMs: number
  selectedKeyframes: string[] | null
  setSelectedKeyframes: (keyframeIds: string[] | null) => void
  alignedKeyframeIds: Set<string>
  containerRef: RefObject<HTMLDivElement>
  onKeyframeMove: (keyframeId: string, time: number) => void
}

export const TrackKeyframes = ({
  track,
  durationMs,
  selectedKeyframes,
  setSelectedKeyframes,
  alignedKeyframeIds,
  containerRef,
  onKeyframeMove,
}: TrackKeyframesProps) => (
  <>
    {track.keyframes.map((kf) => {
      const isKeyframeSelected = selectedKeyframes?.includes(kf.id) ?? false
      return (
        <Keyframe
          key={kf.id}
          id={kf.id}
          isSelected={isKeyframeSelected}
          isAlignedWithPlayhead={alignedKeyframeIds.has(kf.id)}
          time={kf.time}
          trackDurationMs={durationMs}
          trackRef={containerRef}
          onClick={() => setSelectedKeyframes([kf.id])}
          onMove={(time) => onKeyframeMove(kf.id, time)}
        />
      )
    })}
  </>
)
