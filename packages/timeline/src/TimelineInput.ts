import { HedronEngine, IPlugin } from '@hedron-gl/engine'

export class TimelineInput implements IPlugin {
  public readonly id = 'timeline-input'
  public readonly name = 'Timeline Input'
  public readonly inputType = 'timeline-track'
  public readonly description = 'Timeline-based input for automating parameters over time.'

  onEngineInitialize(engine: HedronEngine) {
    const timelineNodeId = `${this.id}-default-timeline`
    engine.addNodeOnce(timelineNodeId, null, {
      title: 'Default Timeline',
      key: 'default-timeline',
      nodeType: 'custom',
      customNodeType: 'timeline',
    })

    engine.addOptionNodes(timelineNodeId, [
      {
        nodeType: 'param',
        key: 'playheadPosition',
        valueType: 'number',
        defaultValue: 0,
      },
      {
        nodeType: 'param',
        key: 'isPlaying',
        valueType: 'boolean',
        defaultValue: false,
      },
    ])
  }

  onNewInput(engine: HedronEngine, inputId: string) {
    const timelineNodeId = `${this.id}-default-timeline`

    engine.addParentToNode(inputId, timelineNodeId, 'trackIds')

    engine.setNodeCustomData(inputId, {
      keyframes: [],
    })
  }
}
