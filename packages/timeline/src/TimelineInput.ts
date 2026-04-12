import { HedronEngine, IPlugin, NodeConfig } from '@hedron-gl/engine'

export class TimelineInput implements IPlugin {
  public readonly id = 'timeline-input'
  public readonly name = 'Timeline Input'
  public readonly inputType = 'timeline-track'
  public readonly description = 'Timeline-based input for automating parameters over time.'

  public readonly globalOptionNodesConfig = [
    {
      key: 'default-timeline',
      nodeType: 'timeline',
      isCustomNode: true,
    },
  ] as NodeConfig[]

  public readonly optionNodesConfig = [] as const satisfies NodeConfig[]

  constructor(engine: HedronEngine) {
    const store = engine.getStore()
    const processedInputIds = new Set<string>()

    store.subscribe(
      (state) => state.nodes,
      (nodes) => {
        const timelineNodeId = `${this.id}-global-default-timeline`

        for (const node of Object.values(nodes)) {
          if (
            !node ||
            node.isCustomNode ||
            node.nodeType !== 'input' ||
            node.inputType !== 'timeline-track'
          )
            continue
          if (processedInputIds.has(node.id)) continue

          processedInputIds.add(node.id)

          const timelineNode = store.getState().nodes[timelineNodeId]
          if (!timelineNode) continue

          const currentTracks =
            ((timelineNode as Record<string, unknown>).tracks as Array<unknown>) ?? []

          store.setState((state) => ({
            nodes: {
              ...state.nodes,
              [timelineNodeId]: {
                ...state.nodes[timelineNodeId],
                tracks: [
                  ...currentTracks,
                  {
                    id: node.id,
                    label: node.title,
                    keyframes: [],
                  },
                ],
              },
            },
          }))
        }
      },
    )
  }
}
