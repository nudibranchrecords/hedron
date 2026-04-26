import { useCallback } from 'react'
import { HedronEngine } from '@hedron-gl/engine'
import { TimelineManager } from '@/TimelineManager'
import type { Keyframe, TimelineManagerData, TimelineTrackInput } from '@/types'

const TIMELINE_NODE_ID = 'timeline-input-default-timeline'
const PLAYHEAD_POSITION_NODE_ID = `${TIMELINE_NODE_ID}-option-playheadPosition`

interface UseTimelineHandlersParams {
  engine: HedronEngine
  manager: TimelineManager
  timeline: TimelineManagerData
}

export const useTimelineHandlers = ({ engine, manager, timeline }: UseTimelineHandlersParams) => {
  const handlePlayheadChange = useCallback(
    (time: number) => {
      engine.setNodeValue(PLAYHEAD_POSITION_NODE_ID, time)
      manager.goTo(time)
    },
    [manager, engine],
  )

  const handleKeyframeDelete = useCallback(
    (keyframeId: string) => {
      for (const track of timeline.tracks) {
        const inputNode = engine.getNode<TimelineTrackInput>(track.id)

        if (!inputNode) continue

        const currentKeyframes: Keyframe[] = inputNode.customData?.keyframes ?? []
        const nextKeyframes = currentKeyframes.filter((kf) => kf.id !== keyframeId)

        if (nextKeyframes.length === currentKeyframes.length) continue

        engine.setNodeCustomData(track.id, { keyframes: nextKeyframes })
        return
      }
    },
    [engine, timeline.tracks],
  )

  const handleKeyframeInsert = useCallback(
    (trackId: string, time: number) => {
      const inputNode = engine.getNode<TimelineTrackInput>(trackId)

      if (!inputNode || inputNode.isCustomNode || inputNode.nodeType !== 'input') {
        return
      }

      const targetNodeValue = engine.getNodeValue(inputNode.targetNodeId)

      const keyframe = {
        id: crypto.randomUUID(),
        time,
        valueType: 'boolean' as const,
        value: targetNodeValue === true,
      }

      const nextKeyframes: Keyframe[] = [...(inputNode.customData?.keyframes ?? []), keyframe].sort(
        (a, b) => a.time - b.time,
      )

      engine.setNodeCustomData(trackId, { keyframes: nextKeyframes })
    },
    [engine],
  )

  return {
    handlePlayheadChange,
    handleKeyframeDelete,
    handleKeyframeInsert,
  }
}
