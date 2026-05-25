import {
  defineOptionNodeConfigs,
  HedronEngine,
  IPlugin,
  OptionNodesFromConfigs,
  Param,
} from '@hedron-gl/engine'
import { DEFAULT_TIMELINE_ID } from './constants'
import { TimelineManager } from './TimelineManager'

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

    this.timelineManagers.forEach((manager, id) => {
      console.log(manager)
      const state = engine.getStore().getState()
      const timelineNode = state.nodes[id]
      // const playheadPositionMs = timelineNode?.childGroups.optionNodeIds
      //   .map((optionNodeId) => state.nodes[optionNodeId])
      //   .find((node) => node?.key === 'playheadPositionMs')
      const isPlaying = timelineNode?.childGroups.optionNodeIds
        .map((optionNodeId) => state.nodes[optionNodeId] as Param)
        .find((node) => node?.key === 'isPlaying')

      engine.subscribeToParamValue(isPlaying!.id, (isPlaying) => {
        if (isPlaying) {
          manager.play()
        } else {
          manager.pause()
        }
      })
    })
  }

  onNewInput(engine: HedronEngine, inputId: string) {
    // Input ID is only a child of the target node, we also need to make it a child of the timeline node so it shows up in the timeline UI
    engine.addChildToNode(DEFAULT_TIMELINE_ID, 'trackIds', inputId)
  }
}
