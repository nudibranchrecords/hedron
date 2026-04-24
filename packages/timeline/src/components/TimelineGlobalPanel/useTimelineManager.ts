import { useEffect, useMemo } from 'react'
import { useEngineStore } from '@hedron-gl/ui-core'
import { TimelineManager } from '@/TimelineManager'

const TIMELINE_NODE_ID = 'timeline-input-default-timeline'
const IS_PLAYING_NODE_ID = `${TIMELINE_NODE_ID}-option-isPlaying`

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
