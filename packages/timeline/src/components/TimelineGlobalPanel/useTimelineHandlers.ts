import { useCallback } from 'react'
import { HedronEngine, ParamNode } from '@hedron-gl/engine'
import { useNodeOptionNodes } from '@hedron-gl/ui-core'
import { DEFAULT_TIMELINE_ID } from '@/constants'
import { TimelineManager } from '@/TimelineManager'
import type { Keyframe, TimelineTrackInput } from '@/types'

interface UseTimelineHandlersParams {
  engine: HedronEngine
  manager: TimelineManager
}

export const useTimelineHandlers = ({ engine, manager }: UseTimelineHandlersParams) => {
  const optionNodes = useNodeOptionNodes(DEFAULT_TIMELINE_ID)
  const playheadPosNodeId = optionNodes['playheadPositionMs']?.id

  const handlePlayheadChange = useCallback(
    (time: number) => {
      engine.setParamValue(playheadPosNodeId, time)

      manager.goTo(time)
    },
    [playheadPosNodeId, manager, engine],
  )

  const handleKeyframeDelete = useCallback(
    (keyframeId: string) => {
      for (const track of manager.getAllTracks()) {
        const inputNode = engine.getNode<TimelineTrackInput>(track.id)

        if (!inputNode) continue

        const currentKeyframes: Keyframe[] = inputNode.customData?.keyframes ?? []
        const nextKeyframes = currentKeyframes.filter((kf) => kf.id !== keyframeId)

        if (nextKeyframes.length === currentKeyframes.length) continue

        engine.setNodeCustomData(track.id, { keyframes: nextKeyframes })
        return
      }
    },
    [engine, manager],
  )

  const handleKeyframeInsert = useCallback(
    (trackId: string, time: number) => {
      const inputNode = engine.getNode<TimelineTrackInput>(trackId)

      if (!inputNode || inputNode.nodeType !== 'input') {
        return
      }

      const targetNode = engine.getNode(inputNode.targetNodeId)

      if (!targetNode) {
        console.error(`Target node not found for input node ${inputNode.id}`)
        return
      }

      let keyframe: Keyframe
      if (targetNode.nodeType === 'shot') {
        // Shot keyframes are momentary triggers; the value isn't used to decide firing.
        keyframe = { id: crypto.randomUUID(), time, valueType: 'shot', value: true }
      } else {
        const targetParamValue = engine.getParamValue(inputNode.targetNodeId)

        if (targetParamValue === undefined) {
          console.error(`Target param value not found for input node ${inputNode.id}`)
          return
        }

        keyframe = {
          id: crypto.randomUUID(),
          time,
          valueType: (targetNode as ParamNode).valueType,
          value: targetParamValue,
        } as Keyframe
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
