import { useEffect, useMemo } from 'react'
import { useEngineStore } from '@hedron-gl/ui-core'
import { TimelineManager } from '@/TimelineManager'

const TIMELINE_NODE_ID = 'timeline-input-default-timeline'
const IS_PLAYING_NODE_ID = `${TIMELINE_NODE_ID}-option-isPlaying`
const PLAYHEAD_POSITION_NODE_ID = `${TIMELINE_NODE_ID}-option-playheadPosition`

export const useTimelineManager = (
  timelineData: Parameters<typeof TimelineManager.prototype.setData>[0],
) => {
  const manager = useMemo(() => new TimelineManager(timelineData), [timelineData])

  useEffect(() => {
    manager.setData(timelineData)
  }, [manager, timelineData])

  const isPlaying = useEngineStore((state) => state.nodeValues[IS_PLAYING_NODE_ID]) as
    | boolean
    | undefined

  const updateNodeValue = useEngineStore((state) => state.updateNodeValue)
  const updateMultipleNodeValues = useEngineStore((state) => state.updateMultipleNodeValues)

  useEffect(() => {
    manager.onUpdate((changed) => {
      updateNodeValue(PLAYHEAD_POSITION_NODE_ID, manager.getPosition())

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
  }, [manager, timelineData.tracks, updateMultipleNodeValues, updateNodeValue])

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
