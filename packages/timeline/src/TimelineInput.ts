import { HedronEngine, IPlugin } from '@hedron-gl/engine'
import { TimelineNode } from './types'

export class TimelineInput implements IPlugin {
  public readonly id = 'timeline-input'
  public readonly name = 'Timeline Input'
  public readonly inputType = 'timeline-track'
  public readonly description = 'Timeline-based input for automating parameters over time.'

  constructor(engine: HedronEngine) {
    const store = engine.getStore()
    const processedInputIds = new Set<string>()

    // store.subscribe(
    //   (state) => state.nodes,
    //   (nodes) => {
    //     const timelineNodeId = `${this.id}-global-default-timeline`

    //     for (const node of Object.values(nodes)) {
    //       if (
    //         !node ||
    //         node.isCustomNode ||
    //         node.nodeType !== 'input' ||
    //         node.inputType !== 'timeline-track'
    //       )
    //         continue
    //       if (processedInputIds.has(node.id)) continue

    //       processedInputIds.add(node.id)

    //       const timelineNode = store.getState().nodes[timelineNodeId] as TimelineNode | undefined

    //       console.log(timelineNode)
    //       if (!timelineNode) continue

    //       store.setState((state) => ({
    //         nodes: {
    //           ...state.nodes,
    //           [timelineNodeId]: {
    //             ...state.nodes[timelineNodeId],
    //             tracks: [
    //               ...timelineNode.tracks,
    //               {
    //                 id: node.id,
    //                 label: node.title,
    //                 keyframes: [],
    //               },
    //             ],
    //           },
    //         },
    //       }))
    //     }
    //   },
    // )
  }

  onEngineInitialize(engine: HedronEngine) {
    const timelineNodeId = `${this.id}-default-timeline`
    engine.addCustomNode<TimelineNode>(timelineNodeId, null, {
      nodeType: 'timeline',
      customData: {
        durationMs: 60000,
      },
      customChildGroups: {
        trackIds: [],
      },
    })
  }
}
