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

  return manager
}
