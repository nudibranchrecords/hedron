import { RefObject } from 'react'
import { Keyframe } from './Keyframe'
import { TimelineManagerKeyframeTrack } from '@/types'

interface TrackKeyframesProps {
  track: TimelineManagerKeyframeTrack
  durationMs: number
  selectedKeyframes: string[] | null
  selectKeyframes: (keyframeIds: string[], isMultiSelect: boolean) => void
  alignedKeyframeIds: Set<string>
  containerRef: RefObject<HTMLDivElement>
  onKeyframeDragStart: (keyframeIds: string[]) => void
  onKeyframeDragMove: (deltaMs: number) => void
}

export const TrackKeyframes = ({
  track,
  durationMs,
  selectedKeyframes,
  selectKeyframes,
  alignedKeyframeIds,
  containerRef,
  onKeyframeDragStart,
  onKeyframeDragMove,
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
          onSelect={({ isMultiSelect }) => selectKeyframes([kf.id], isMultiSelect)}
          onMoveStart={() => onKeyframeDragStart([kf.id])}
          onMove={onKeyframeDragMove}
        />
      )
    })}
  </>
)
