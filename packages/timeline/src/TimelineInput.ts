import {
  defineOptionNodeConfigs,
  HedronEngine,
  InputNode,
  IPlugin,
  isEqual,
  OptionNodesFromConfigs,
  isParamVector,
  ParamNode,
  ShotNode,
  isParamVectorComponent,
} from '@hedron-gl/engine'
import { DEFAULT_TIMELINE_ID, TIMELINE_DURATION } from './constants'
import { TimelineManager } from './TimelineManager'
import { getTimelineTracks } from './selectors/getTimelineTracks'
import { TimelineManagerKeyframeTrack, TimelineManagerTrack } from './types'

// defineOptionNodeConfigs is only needed if we want nice TS node name inference in other parts of the plugin
export const TIMELINE_OPTION_NODE_CONFIGS = defineOptionNodeConfigs([
  {
    nodeType: 'param',
    key: 'playheadPositionMs',
    valueType: 'number',
    defaultValue: 0,
  },
  {
    nodeType: 'param',
    key: 'isPlaying',
    valueType: 'boolean',
    defaultValue: false,
  },
  // This is a cheap hack to get audio working, eventually you'll manually add an audio track
  {
    nodeType: 'param',
    key: 'audioUrl',
    valueType: 'file',
    defaultValue: null,
    accept: ['audio/*'],
  },
])

// We can use TimelineOptionNodes for strong typing when using useNodeOptionNodes
export type TimelineOptionNodes = OptionNodesFromConfigs<typeof TIMELINE_OPTION_NODE_CONFIGS>

const getKeyframeTracks = (tracks: TimelineManagerTrack[]): TimelineManagerKeyframeTrack[] => {
  const keyframeTracks: TimelineManagerKeyframeTrack[] = []

  for (const track of tracks) {
    if (track.trackType === 'keyframe') {
      keyframeTracks.push(track)
      continue
    }

    if (track.trackType === 'vector') {
      keyframeTracks.push(...getKeyframeTracks(track.childTracks))
    }
  }

  return keyframeTracks
}

export class TimelineInput implements IPlugin {
  public readonly id = 'timeline-input'
  public readonly name = 'Timeline Input'
  public readonly iconName = 'timeline'
  public readonly inputType = 'timeline-track'
  public readonly description = 'Timeline-based input for automating parameters over time.'
  public timelineManagers: Map<string, TimelineManager> = new Map()

  onEngineInitialize(engine: HedronEngine) {
    engine.addNodeOnce(DEFAULT_TIMELINE_ID, null, {
      title: 'Default Timeline',
      key: 'default-timeline',
      nodeType: 'custom',
      customNodeType: 'timeline',
    })

    engine.addOptionNodes(DEFAULT_TIMELINE_ID, TIMELINE_OPTION_NODE_CONFIGS)

    this.timelineManagers.set(
      DEFAULT_TIMELINE_ID,
      new TimelineManager(
        {
          durationMs: TIMELINE_DURATION,
          tracks: [],
        },
        engine.clock,
      ),
    )

    this.timelineManagers.forEach((manager, timelineId) => {
      const isPlaying = engine.getNodeOptionNode(timelineId, 'isPlaying')
      const playHeadPositionNode = engine.getNodeOptionNode(timelineId, 'playheadPositionMs')

      engine.getStore().subscribe(
        (state) => getTimelineTracks(state, timelineId),
        (tracks) => {
          manager.setTracks(tracks)
        },
        {
          equalityFn: isEqual,
          fireImmediately: true,
        },
      )

      engine.subscribeToParamValue(isPlaying.id, (isPlaying) => {
        if (isPlaying) {
          manager.play()
        } else {
          manager.pause()
        }
      })

      manager.onUpdate((changed) => {
        engine.setParamValue(playHeadPositionNode.id, manager.getPosition())

        const changedTrackIds = Object.keys(changed)
        if (changedTrackIds.length > 0) {
          const allTracks = getTimelineTracks(engine.getStoreState(), timelineId)
          const tracks = getKeyframeTracks(allTracks)
          const changedTargetNodeIds = changedTrackIds.map(
            (trackId) => tracks.find((track) => track.id === trackId)?.targetNodeId ?? trackId,
          )

          engine.setMultipleParamValues(
            changedTargetNodeIds,
            changedTrackIds.map((trackId) => changed[trackId]),
          )
        }
      })
    })
  }

  onNewInput(engine: HedronEngine, newInput: InputNode, targetNode: ParamNode | ShotNode) {
    // Don't do anything if we're dealing with a vector component (e.g. x,y,z)
    if (isParamVectorComponent(targetNode, engine)) {
      return
    }

    // Input ID is only a child of the target node, we also need to make it a child of the timeline node so it shows up in the timeline UI
    engine.addChildToNode(DEFAULT_TIMELINE_ID, 'trackIds', newInput.id)

    if (isParamVector(targetNode)) {
      targetNode.childGroups.vectorComponentIds.forEach((nodeId) => {
        const childInput = engine.addInput(this.inputType, nodeId)!

        // Add vector components as children of parent track
        engine.addChildToNode(newInput.id, 'trackIds', childInput.id)
      })
    }
  }
}
