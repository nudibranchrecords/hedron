import { HedronEngine, IPlugin } from '@hedron-gl/engine'
import { TimelineNode, TimelineTrackNode } from './types'

export class TimelineInput implements IPlugin {
  public readonly id = 'timeline-input'
  public readonly name = 'Timeline Input'
  public readonly inputType = 'timeline-track'
  public readonly description = 'Timeline-based input for automating parameters over time.'

  // constructor(engine: HedronEngine) {}

  onEngineInitialize(engine: HedronEngine) {
    const timelineNodeId = `${this.id}-default-timeline`
    engine.addNodeOnce<TimelineNode>(timelineNodeId, null, {
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
    const store = engine.getStore()

    store.setState((state) => {
      // TODO: Have a proper way to set child/parent relationship. We're not setting parentId on the input here...
      state.nodes[timelineNodeId]?.childGroups.trackIds.push(inputId)
    })

    engine.addOptionNodes<TimelineTrackNode>(inputId, [
      {
        isCustomNode: true,
        nodeType: 'timeline-track',
        customData: {
          keyframes: [],
        },
        customChildGroups: {},
      },
    ])
  }
}
