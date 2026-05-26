import {
  defineOptionNodeConfigs,
  HedronEngine,
  IPlugin,
  isEqual,
  OptionNodesFromConfigs,
} from '@hedron-gl/engine'
import { DEFAULT_TIMELINE_ID } from './constants'
import { TimelineManager } from './TimelineManager'
import { getTimelineTracks } from './selectors/getTimelineTracks'
import { TimelineManagerKeyframeTrack } from './types'

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

export class TimelineInput implements IPlugin {
  public readonly id = 'timeline-input'
  public readonly name = 'Timeline Input'
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
      new TimelineManager({
        durationMs: 60000,
        tracks: [],
      }),
    )

    this.timelineManagers.forEach((manager, timelineId) => {
      const isPlaying = engine.getNodeOptionNode(timelineId, 'isPlaying')
      const playHeadPositionNode = engine.getNodeOptionNode(timelineId, 'playheadPositionMs')

      const tracks = getTimelineTracks(engine.getStoreState(), timelineId)
      manager.setTracks(tracks)

      engine.getStore().subscribe(
        (state) => getTimelineTracks(state, timelineId),
        (tracks, prevTracks) => {
          if (!isEqual(tracks, prevTracks)) {
            manager.setTracks(tracks)
          }
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
          const tracks = getTimelineTracks(engine.getStoreState(), timelineId).filter(
            (track): track is TimelineManagerKeyframeTrack => track.trackType === 'keyframe',
          )
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

  onNewInput(engine: HedronEngine, inputId: string) {
    // Input ID is only a child of the target node, we also need to make it a child of the timeline node so it shows up in the timeline UI
    engine.addChildToNode(DEFAULT_TIMELINE_ID, 'trackIds', inputId)
  }
}
