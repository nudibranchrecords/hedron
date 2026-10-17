import { useEngine } from '@hedron-gl/ui-core'

import { TimelineInput } from '@/TimelineInput'

export const useTimelineManager = (timelineId: string) => {
  const engine = useEngine()
  const manager = engine
    .getPlugin<TimelineInput>('timeline-input')
    ?.timelineManagers.get(timelineId)

  if (!manager) {
    throw new Error(
      'Could not find TimelineManager instance on TimelineInput plugin. Timeline will not function.',
    )
  }

  return manager
}
