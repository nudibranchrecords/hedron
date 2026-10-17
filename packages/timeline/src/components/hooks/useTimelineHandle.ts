import { useRef } from 'react'
import { useSubscribeToParamValue } from '@hedron-gl/ui-core'
import { TimelineHandle } from '@/components/Timeline/Timeline'

export const useTimelineHandle = (
  zoomPxPerSecondNodeId: string | undefined,
  playheadPositionNodeId: string | undefined,
) => {
  const timelineRef = useRef<TimelineHandle>(null)

  useSubscribeToParamValue<number>(zoomPxPerSecondNodeId, (value) => {
    timelineRef.current?.setPxPerSecond(value)
  })

  useSubscribeToParamValue<number>(playheadPositionNodeId, (value) => {
    timelineRef.current?.setPlayheadPositionMs(value)
  })

  return timelineRef
}
