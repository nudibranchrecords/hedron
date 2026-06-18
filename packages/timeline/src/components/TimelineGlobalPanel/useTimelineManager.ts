import { useEffect, useMemo } from 'react'
import { useEngineStore, useNodeOptionNodes, useSubscribeToNodeValue } from '@hedron-gl/ui-core'
import { TimelineManager } from '@/TimelineManager'
import { DEFAULT_TIMELINE_ID } from '@/constants'

export const useTimelineManager = (
  timelineData: Parameters<typeof TimelineManager.prototype.setData>[0],
) => {
  const manager = useMemo(() => new TimelineManager(timelineData), [timelineData])

  useEffect(() => {
    manager.setData(timelineData)
  }, [manager, timelineData])

  const optionNodes = useNodeOptionNodes(DEFAULT_TIMELINE_ID)

  const playHeadPositionNode = optionNodes['playheadPositionMs']

  const updateNodeValue = useEngineStore((state) => state.updateNodeValue)
  const updateMultipleNodeValues = useEngineStore((state) => state.updateMultipleNodeValues)

  useSubscribeToNodeValue<boolean>(optionNodes['isPlaying']?.id, (isPlaying) => {
    if (isPlaying) {
      manager.play()
    } else {
      manager.pause()
    }
  })

  useEffect(() => {
    if (!playHeadPositionNode?.id) {
      console.warn(
        'Playhead position node not found, something went wrong with the timeline manager setup. Timeline will not update playhead position.',
      )
      return
    }

    manager.onUpdate((changed) => {
      updateNodeValue(playHeadPositionNode.id, manager.getPosition())

      const changedTrackIds = Object.keys(changed)
      if (changedTrackIds.length > 0) {
        const changedTargetNodeIds = changedTrackIds.map(
          (trackId) =>
            timelineData.tracks.find((track) => track.id === trackId)?.targetNodeId ?? trackId,
        )

        updateMultipleNodeValues(
          changedTargetNodeIds,
          changedTrackIds.map((trackId) => changed[trackId]),
        )
      }
    })
  }, [
    manager,
    playHeadPositionNode?.id,
    timelineData.tracks,
    updateMultipleNodeValues,
    updateNodeValue,
  ])

  useEffect(() => {
    return () => manager.dispose()
  }, [manager])

  return manager
}
