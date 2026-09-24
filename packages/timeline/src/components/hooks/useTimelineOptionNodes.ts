import { useNodeOptionNodes, useParamValue } from '@hedron-gl/ui-core'
import { DEFAULT_TIMELINE_ID } from '@/constants'
import { TimelineOptionNodes } from '@/TimelineInput'

export const useTimelineOptionNodes = (timelineId = DEFAULT_TIMELINE_ID) => {
  const optionNodes = useNodeOptionNodes<TimelineOptionNodes>(timelineId)
  const isPlayingNode = optionNodes['isPlaying']!
  const playheadPositionNode = optionNodes['playheadPositionMs']
  const audioUrlNode = optionNodes['audioUrl']!
  const zoomPxPerSecondNode = optionNodes['zoomPxPerSecond']!
  const durationNode = optionNodes['timelineDurationS']!

  const isPlaying = useParamValue<boolean>(isPlayingNode?.id, false)
  const playheadPositionMs = useParamValue<number>(playheadPositionNode?.id, 0)
  const audioUrl = useParamValue<string | null>(audioUrlNode?.id, null)
  const zoomPxPerSecond = useParamValue<number>(zoomPxPerSecondNode?.id, 80)
  const durationS = useParamValue<number>(durationNode?.id, 0)

  return {
    optionNodes,
    isPlayingNode,
    isPlaying,
    playheadPositionNode,
    playheadPositionMs,
    audioUrlNode,
    audioUrl,
    zoomPxPerSecondNode,
    zoomPxPerSecond,
    durationNode,
    durationS,
  }
}
