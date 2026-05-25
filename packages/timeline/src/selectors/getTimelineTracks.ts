import { EngineState, Input } from '@hedron-gl/engine'
import { TimelineManagerTrack, TimelineNode, TimelineTrackInput } from '@/types'

export const getTimelineTracks = (
  state: EngineState,
  timelineId: string,
): TimelineManagerTrack[] => {
  const timelineNode = state.nodes[timelineId] as TimelineNode | undefined
  const trackIds = timelineNode?.childGroups.trackIds ?? []

  return trackIds
    .map((inputId): TimelineManagerTrack | null => {
      const inputNode = state.nodes[inputId] as TimelineTrackInput | undefined
      if (!inputNode) return null

      const targetNodeId = (inputNode as Input).targetNodeId
      const targetNode = targetNodeId ? state.nodes[targetNodeId] : undefined
      if (!targetNode) return null

      return {
        id: inputId,
        label: targetNode.title,
        keyframes: inputNode.customData?.keyframes ?? [],
        targetNodeId,
      }
    })
    .filter((track): track is TimelineManagerTrack => track !== null)
}
