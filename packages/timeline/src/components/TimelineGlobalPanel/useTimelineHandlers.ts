import { useCallback } from 'react'
import { HedronEngine } from '@hedron-gl/engine'
import { useNodeOptionNodes } from '@hedron-gl/ui-core'
import { DEFAULT_TIMELINE_ID } from '@/constants'
import { TimelineManager } from '@/TimelineManager'
import type { Keyframe, TimelineManagerData, TimelineTrackInput } from '@/types'

interface UseTimelineHandlersParams {
  engine: HedronEngine
  manager: TimelineManager
  timeline: TimelineManagerData
}

export const useTimelineHandlers = ({ engine, manager, timeline }: UseTimelineHandlersParams) => {
  const optionNodes = useNodeOptionNodes(DEFAULT_TIMELINE_ID)
  const playheadPosNodeId = optionNodes['playheadPositionMs']?.id

  const handlePlayheadChange = useCallback(
    (time: number) => {
      engine.setNodeValue(playheadPosNodeId, time)

      manager.goTo(time)
    },
    [playheadPosNodeId, manager, engine],
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

      if (!inputNode || inputNode.nodeType !== 'input') {
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
