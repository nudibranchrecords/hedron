import { HedronEngine, IPlugin } from '@hedron-gl/engine'
import { DEFAULT_TIMELINE_ID } from './constants'

export class TimelineInput implements IPlugin {
  public readonly id = 'timeline-input'
  public readonly name = 'Timeline Input'
  public readonly inputType = 'timeline-track'
  public readonly description = 'Timeline-based input for automating parameters over time.'

  onEngineInitialize(engine: HedronEngine) {
    engine.addNodeOnce(DEFAULT_TIMELINE_ID, null, {
      title: 'Default Timeline',
      nodeType: 'custom',
      customNodeType: 'timeline',
      // TODO: With proper config typing we wouldn't need all this boilerplate config
      id: DEFAULT_TIMELINE_ID,
      parentIds: [],
      childGroups: {
        optionNodeIds: [],
        inputNodeIds: [],
      },
    })

    engine.addOptionNodes(DEFAULT_TIMELINE_ID, [
      {
        key: 'playheadPositionMs',
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
    engine.addParentToNode(inputId, DEFAULT_TIMELINE_ID, 'trackIds')
  }
}
