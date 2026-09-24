import { useCallback } from 'react'
import { HedronEngine } from '@hedron-gl/engine'
import { useNodeOptionNodes, useParamValue } from '@hedron-gl/ui-core'
import { DEFAULT_TIMELINE_ID } from '@/constants'
import { TimelineManager } from '@/TimelineManager'
import type { Keyframe, KeyframeParam, TimelineTrackInput } from '@/types'
import { addKeyframe, removeKeyframe, setKeyframeTime } from '@/utils/keyframeOperations'

interface UseTimelineHandlersParams {
  engine: HedronEngine
  manager: TimelineManager
}

export const useTimelineHandlers = ({ engine, manager }: UseTimelineHandlersParams) => {
  const optionNodes = useNodeOptionNodes(DEFAULT_TIMELINE_ID)
  const playheadPosNodeId = optionNodes['playheadPositionMs']?.id
  const isPlayingNodeId = optionNodes['isPlaying']?.id

  const isPlaying = useParamValue<boolean>(isPlayingNodeId, false)

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
        const nextKeyframes = removeKeyframe(currentKeyframes, keyframeId)

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
        keyframe = { id: crypto.randomUUID(), time, nodeType: 'shot' }
      } else if (targetNode.nodeType === 'param') {
        const targetParamValue = engine.getParamValue(inputNode.targetNodeId)

        if (targetParamValue === undefined) {
          console.error(`Target param value not found for input node ${inputNode.id}`)
          return
        }

        keyframe = {
          id: crypto.randomUUID(),
          time,
          valueType: targetNode.valueType,
          value: targetParamValue,
          nodeType: 'param',
        } as KeyframeParam
      } else {
        throw new Error(
          `Unsupported target node type for input node ${inputNode.id} with type ${targetNode.nodeType}`,
        )
      }

      const nextKeyframes = addKeyframe(inputNode.customData?.keyframes ?? [], keyframe)

      engine.setNodeCustomData(trackId, { keyframes: nextKeyframes })
    },
    [engine],
  )

  const handleKeyframeMove = useCallback(
    (keyframeId: string, time: number) => {
      for (const track of manager.getAllTracks()) {
        const inputNode = engine.getNode<TimelineTrackInput>(track.id)

        if (!inputNode) continue

        const currentKeyframes: Keyframe[] = inputNode.customData?.keyframes ?? []

        if (!currentKeyframes.some((kf) => kf.id === keyframeId)) continue

        engine.setNodeCustomData(track.id, {
          keyframes: setKeyframeTime(currentKeyframes, keyframeId, time),
        })
        return
      }
    },
    [engine, manager],
  )

  const handlePlayPauseToggle = useCallback(() => {
    console.log(isPlaying)
    engine.setParamValue(isPlayingNodeId, !isPlaying)
  }, [engine, isPlayingNodeId, isPlaying])

  return {
    handlePlayheadChange,
    handleKeyframeDelete,
    handleKeyframeInsert,
    handleKeyframeMove,
    handlePlayPauseToggle,
  }
}
