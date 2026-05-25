import { useEffect, useRef } from 'react'
import { useEngine, useEngineStore, useNodeOptionNodes } from '@hedron-gl/ui-core'

import { TimelineManager } from '@/TimelineManager'
import { TimelineInput } from '@/TimelineInput'

export const useTimelineManager = (
  timelineId: string,
  timelineData: Parameters<typeof TimelineManager.prototype.setData>[0],
) => {
  const engine = useEngine()
  const manager = engine
    .getPlugin<TimelineInput>('timeline-input')
    ?.timelineManagers.get(timelineId)

  if (!manager) {
    throw new Error(
      'Could not find TimelineManager instance on TimelineInput plugin. Timeline will not function.',
    )
  }

  const managerRef = useRef<TimelineManager>(manager)

  useEffect(() => {
    managerRef.current.setData(timelineData)
  }, [engine, timelineData, timelineId])

  const optionNodes = useNodeOptionNodes(timelineId)

  const playHeadPositionNode = optionNodes['playheadPositionMs']

  const updateParamValue = useEngineStore((state) => state.updateParamValue)
  const updateMultipleParamValues = useEngineStore((state) => state.updateMultipleParamValues)

  useEffect(() => {
    if (!playHeadPositionNode?.id) {
      console.warn(
        'Playhead position node not found, something went wrong with the timeline manager setup. Timeline will not update playhead position.',
      )
      return
    }

    managerRef.current.onUpdate((changed) => {
      updateParamValue(playHeadPositionNode.id, managerRef.current.getPosition())

      const changedTrackIds = Object.keys(changed)
      if (changedTrackIds.length > 0) {
        const changedTargetNodeIds = changedTrackIds.map(
          (trackId) =>
            timelineData.tracks.find((track) => track.id === trackId)?.targetNodeId ?? trackId,
        )

        updateMultipleParamValues(
          changedTargetNodeIds,
          changedTrackIds.map((trackId) => changed[trackId]),
        )
      }
    })
  }, [
    manager,
    playHeadPositionNode?.id,
    timelineData.tracks,
    updateMultipleParamValues,
    updateParamValue,
  ])

  return manager
}
