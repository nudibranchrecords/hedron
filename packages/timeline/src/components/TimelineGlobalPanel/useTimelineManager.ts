import { useEffect, useMemo } from 'react'
import { useEngineStore, useNodeOptionNodes } from '@hedron-gl/ui-core'
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
  const isPlayingNode = optionNodes['isPlaying']!
  const playHeadPositionNode = optionNodes['playheadPositionMs']!
  const isPlaying = useEngineStore(
    (state) => state.nodeValues[isPlayingNode?.id] as boolean | undefined,
  )

  const updateNodeValue = useEngineStore((state) => state.updateNodeValue)
  const updateMultipleNodeValues = useEngineStore((state) => state.updateMultipleNodeValues)

  useEffect(() => {
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
    playHeadPositionNode.id,
    timelineData.tracks,
    updateMultipleNodeValues,
    updateNodeValue,
  ])

  useEffect(() => {
    if (isPlaying) {
      manager.play()
    } else {
      manager.pause()
    }
  }, [isPlaying, manager])

  useEffect(() => {
    return () => manager.dispose()
  }, [manager])

  return manager
}
