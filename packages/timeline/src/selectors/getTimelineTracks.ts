import {
  EngineState,
  InputNode,
  isParamVector,
  ParamNode,
  getParamValue,
  getNodeAncestorSketch,
} from '@hedron-gl/engine'
import { DEFAULT_AUDIO_TRACK_ID, SKETCH_TRACK_ID_PREFIX } from '@/constants'
import {
  TimelineManagerKeyframeTrack,
  TimelineManagerSketchTrack,
  TimelineManagerTrack,
  TimelineManagerVectorTrack,
  TimelineNode,
  TimelineTrackInput,
} from '@/types'

export const getTimelineTracks = (
  state: EngineState,
  timelineId: string,
): TimelineManagerTrack[] => {
  const timelineNode = state.nodes[timelineId] as TimelineNode | undefined
  const trackIds = timelineNode?.childGroups.trackIds ?? []

  const createKeyframeTrack = (
    inputId: string,
  ): TimelineManagerKeyframeTrack | TimelineManagerVectorTrack | null => {
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

  const tracks: TimelineManagerTrack[] = []
  const sketchGroups = new Map<string, TimelineManagerSketchTrack>()

  for (const inputId of trackIds) {
    const track = createKeyframeTrack(inputId)
    if (!track) continue

    const inputNode = state.nodes[inputId] as TimelineTrackInput | undefined
    const targetNodeId = (inputNode as InputNode | undefined)?.targetNodeId
    const sketchNode = targetNodeId ? getNodeAncestorSketch(state, targetNodeId) : null

    if (!sketchNode) {
      tracks.push(track)
      continue
    }

    let sketchGroup = sketchGroups.get(sketchNode.id)

    if (!sketchGroup) {
      sketchGroup = {
        id: `${SKETCH_TRACK_ID_PREFIX}${sketchNode.id}`,
        label: sketchNode.title,
        trackType: 'sketch',
        childTracks: [],
      }
      sketchGroups.set(sketchNode.id, sketchGroup)
      tracks.push(sketchGroup)
    }

    sketchGroup.childTracks.push(track)
  }

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
