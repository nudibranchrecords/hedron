import { useRef } from 'react'
import { useSubscribeToParamValue } from '@hedron-gl/ui-core'
import { TimelineHandle } from '@/components/Timeline/Timeline'

export const useTimelineHandle = (zoomPxPerSecondNodeId: string | undefined) => {
  const timelineRef = useRef<TimelineHandle>(null)

  useSubscribeToParamValue<number>(zoomPxPerSecondNodeId, (value) => {
    timelineRef.current?.setPxPerSecond(value)
  })

  return timelineRef
}
