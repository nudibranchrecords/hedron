import { HedronEngine, IPlugin, NodeConfig } from '@hedron-gl/engine'

export class TimelineInput implements IPlugin {
  public readonly id = 'timeline-input'
  public readonly name = 'Timeline Input'
  public readonly inputType = 'timeline'
  public readonly description = 'Timeline-based input for automating parameters over time.'

  public readonly globalOptionNodesConfig = [] as NodeConfig[]

  public readonly optionNodesConfig = [] as const satisfies NodeConfig[]

  constructor(_engine: HedronEngine) {}
}
