import { EngineState, InputNode, isParamVector, ParamNode, getParamValue } from '@hedron-gl/engine'
import { DEFAULT_AUDIO_TRACK_ID } from '@/constants'
import {
  TimelineManagerKeyframeTrack,
  TimelineManagerTrack,
  TimelineNode,
  TimelineTrackInput,
} from '@/types'

export const getTimelineTracks = (
  state: EngineState,
  timelineId: string,
): TimelineManagerTrack[] => {
  const timelineNode = state.nodes[timelineId] as TimelineNode | undefined
  const trackIds = timelineNode?.childGroups.trackIds ?? []

  const createKeyframeTrack = (inputId: string): TimelineManagerTrack | null => {
    const inputNode = state.nodes[inputId] as TimelineTrackInput | undefined
    if (!inputNode) return null

    const targetNodeId = (inputNode as InputNode).targetNodeId
    const targetNode = targetNodeId ? state.nodes[targetNodeId] : undefined
    if (!targetNode) return null

    if (isParamVector(targetNode)) {
      const childTrackIds =
        (inputNode.childGroups as { trackIds?: string[] } | undefined)?.trackIds ?? []
      const childTracks = childTrackIds
        .map((childTrackId: string) => createKeyframeTrack(childTrackId))
        .filter((track): track is TimelineManagerKeyframeTrack => track !== null)

      return {
        trackType: 'vector',
        id: inputId,
        label: targetNode.title,
        childTracks,
      }
    }

    return {
      trackType: 'keyframe',
      id: inputId,
      label: targetNode.title,
      keyframes: inputNode.customData?.keyframes ?? [],
      targetNodeId,
    }
  }

  const tracks = trackIds
    .map((inputId): TimelineManagerTrack | null => createKeyframeTrack(inputId))
    .filter((track): track is TimelineManagerTrack => track !== null)

  // TODO: This is how we hack in an audio track for now
  const optionNodeIds = timelineNode?.childGroups.optionNodeIds ?? []
  const audioUrlNodeId = optionNodeIds.find(
    (optionNodeId) => (state.nodes[optionNodeId] as ParamNode)?.key === 'audioUrl',
  )

  if (audioUrlNodeId) {
    // The raw node value is just the file name
    const label = state.paramValues[audioUrlNodeId] as string
    // getParamValue returns the full url path for resources
    const audioUrl = getParamValue(state, audioUrlNodeId) as string

    tracks.unshift({
      id: DEFAULT_AUDIO_TRACK_ID,
      label,
      trackType: 'audio',
      audioUrl,
    })
  }
  /// end hack

  return tracks
}
