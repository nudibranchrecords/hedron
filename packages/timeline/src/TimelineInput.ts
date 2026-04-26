import { HedronEngine, IPlugin } from '@hedron-gl/engine'
import { TimelineNode } from './types'

export class TimelineInput implements IPlugin {
  public readonly id = 'timeline-input'
  public readonly name = 'Timeline Input'
  public readonly inputType = 'timeline-track'
  public readonly description = 'Timeline-based input for automating parameters over time.'

  // constructor(engine: HedronEngine) {}

  onEngineInitialize(engine: HedronEngine) {
    const timelineNodeId = `${this.id}-default-timeline`
    engine.addNodeOnce<TimelineNode>(timelineNodeId, null, {
      title: 'Default Timeline',
      isCustomNode: true,
      nodeType: 'timeline',
      customData: {
        durationMs: 60000,
      },
      customChildGroups: {
        trackIds: [],
      },
    })

    engine.addOptionNodes(timelineNodeId, [
      {
        key: 'playheadPosition',
        valueType: 'number',
        defaultValue: 0,
      },
      {
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
