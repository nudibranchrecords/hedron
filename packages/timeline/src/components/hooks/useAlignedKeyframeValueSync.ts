import { useEffect } from 'react'
import { HedronEngine, isEqual, ParamValue } from '@hedron-gl/engine'
import { TimelineManager } from '@/TimelineManager'
import { AlignedKeyframe, Keyframe, TimelineTrackInput } from '@/types'

interface UseAlignedKeyframeValueSyncParams {
  engine: HedronEngine
  manager: TimelineManager
  alignedKeyframes: AlignedKeyframe[]
  isEnabled: boolean
}

const updateAlignedKeyframesForValue = (
  engine: HedronEngine,
  alignedKeyframes: AlignedKeyframe[],
  value: ParamValue,
) => {
  const alignedKeyframeIdsByTrack = new Map<string, Set<string>>()

  for (const { trackId, keyframe } of alignedKeyframes) {
    if (keyframe.nodeType !== 'param') continue

    const alignedKeyframeIds = alignedKeyframeIdsByTrack.get(trackId) ?? new Set<string>()
    alignedKeyframeIds.add(keyframe.id)
    alignedKeyframeIdsByTrack.set(trackId, alignedKeyframeIds)
  }

  for (const [trackId, alignedKeyframeIds] of alignedKeyframeIdsByTrack) {
    const inputNode = engine.getNode<TimelineTrackInput>(trackId)
    if (!inputNode || inputNode.nodeType !== 'input') continue

    const currentKeyframes = inputNode.customData?.keyframes ?? []
    let hasChanged = false
    const nextKeyframes: Keyframe[] = currentKeyframes.map((keyframe) => {
      if (
        keyframe.nodeType !== 'param' ||
        !alignedKeyframeIds.has(keyframe.id) ||
        isEqual(keyframe.value, value)
      ) {
        return keyframe
      }

      hasChanged = true
      return { ...keyframe, value } as Keyframe
    })

    if (hasChanged) {
      engine.setNodeCustomData(trackId, { keyframes: nextKeyframes })
    }
  }
}

export const useAlignedKeyframeValueSync = ({
  engine,
  manager,
  alignedKeyframes,
  isEnabled,
}: UseAlignedKeyframeValueSyncParams) => {
  useEffect(() => {
    if (!isEnabled || manager.isPlaying() || alignedKeyframes.length === 0) return

    const alignedKeyframesByTargetNodeId = new Map<string, AlignedKeyframe[]>()

    for (const alignedKeyframe of alignedKeyframes) {
      if (alignedKeyframe.keyframe.nodeType !== 'param') continue

      const targetNodeId = alignedKeyframe.targetNodeId ?? alignedKeyframe.trackId
      const targetNode = engine.getNode(targetNodeId)
      if (targetNode?.nodeType !== 'param') continue

      const alignedForTarget = alignedKeyframesByTargetNodeId.get(targetNodeId) ?? []
      alignedForTarget.push(alignedKeyframe)
      alignedKeyframesByTargetNodeId.set(targetNodeId, alignedForTarget)
    }

    const unsubscribers = Array.from(alignedKeyframesByTargetNodeId.entries()).map(
      ([targetNodeId, alignedForTarget]) =>
        engine.subscribeToParamValue(
          targetNodeId,
          (value) => {
            if (!isEnabled || manager.isPlaying() || value === undefined) return
            // Timeline playback/scrubbing writes these params too, so only user edits should stick.
            if (engine.getLastParamValueOrigin(targetNodeId) !== 'user') return

            updateAlignedKeyframesForValue(engine, alignedForTarget, value)
          },
          { fireImmediately: false },
        ),
    )

    return () => {
      for (const unsubscribe of unsubscribers) {
        unsubscribe()
      }
    }
  }, [engine, manager, alignedKeyframes, isEnabled])
}
