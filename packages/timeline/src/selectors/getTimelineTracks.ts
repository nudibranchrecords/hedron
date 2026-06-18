import { EngineState, Input, Param, ParamFileValue } from '@hedron-gl/engine'
import { DEFAULT_AUDIO_TRACK_ID } from '@/constants'
import { TimelineManagerTrack, TimelineNode, TimelineTrackInput } from '@/types'

export const getTimelineTracks = (
  state: EngineState,
  timelineId: string,
): TimelineManagerTrack[] => {
  const timelineNode = state.nodes[timelineId] as TimelineNode | undefined
  const trackIds = timelineNode?.childGroups.trackIds ?? []

  const tracks = trackIds
    .map((inputId): TimelineManagerTrack | null => {
      const inputNode = state.nodes[inputId] as TimelineTrackInput | undefined
      if (!inputNode) return null

      const targetNodeId = (inputNode as Input).targetNodeId
      const targetNode = targetNodeId ? state.nodes[targetNodeId] : undefined
      if (!targetNode) return null

      return {
        trackType: 'keyframe',
        id: inputId,
        label: targetNode.title,
        keyframes: inputNode.customData?.keyframes ?? [],
        targetNodeId,
      }
    })
    .filter((track): track is TimelineManagerTrack => track !== null)

  // TODO: This is how we hack in an audio track for now
  const optionNodeIds = timelineNode?.childGroups.optionNodeIds ?? []
  const audioUrlNodeId = optionNodeIds.find(
    (optionNodeId) => (state.nodes[optionNodeId] as Param)?.key === 'audioUrl',
  )
  const resourceId = state.paramValues[audioUrlNodeId ?? ''] as ParamFileValue | undefined
  const resource = resourceId ? state.resources[resourceId] : null

  if (resource) {
    tracks.unshift({
      id: DEFAULT_AUDIO_TRACK_ID,
      label: resource?.fileName,
      trackType: 'audio',
      audioUrl: `${state.resourcesUrl}/${resource?.filePath}`,
    })
  }
  /// end hack

  return tracks
}
