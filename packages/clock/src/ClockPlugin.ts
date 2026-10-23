import {
  defineOptionNodeConfigs,
  HedronEngine,
  IPlugin,
  OptionNodesFromConfigs,
  PluginUpdateArgs,
  ShotFunc,
} from '@hedron-gl/engine'
import { Clock, DEFAULT_BPM, isValidBpm } from './Clock'
import { CLOCK_NODE_ID, CLOCK_PLUGIN_ID } from './constants'

export const createClockOptionNodeConfigs = (actions: {
  togglePlay: ShotFunc
  reset: ShotFunc
  tapTempo: ShotFunc
}) =>
  defineOptionNodeConfigs([
    {
      nodeType: 'param',
      key: 'globalClockBpm',
      title: 'BPM',
      valueType: 'number',
      displayMode: 'field',
      defaultValue: DEFAULT_BPM,
      sliderMin: 60,
      sliderMax: 200,
    },
    {
      nodeType: 'shot',
      key: 'togglePlay',
      title: 'Play/Pause',
      func: actions.togglePlay,
    },
    {
      nodeType: 'shot',
      key: 'reset',
      title: 'Reset',
      func: actions.reset,
    },
    {
      nodeType: 'shot',
      key: 'tapTempo',
      title: 'Tap Tempo',
      func: actions.tapTempo,
    },
  ])

export type ClockOptionNodes = OptionNodesFromConfigs<
  ReturnType<typeof createClockOptionNodeConfigs>
>

/**
 * Owns the global `Clock`. BPM lives in the `globalClockBpm` option node (project state): BPM changes
 * calculated by the clock are written to the node, and node changes are applied to the clock.
 */
export class ClockPlugin implements IPlugin {
  public readonly id = CLOCK_PLUGIN_ID
  public readonly name = 'Clock'
  public readonly iconName = 'timer'
  public readonly description = 'Global clock, providing BPM and beat timing for other plugins.'
  public readonly clock: Clock

  private unsubscribers: (() => void)[] = []

  constructor() {
    this.clock = new Clock(DEFAULT_BPM)
  }

  onEngineInitialize(engine: HedronEngine) {
    // Engine may be initialized multiple times (e.g. loading a new project)
    this.unsubscribers.forEach((unsubscribe) => unsubscribe())
    this.unsubscribers = []

    engine.addNodeOnce(CLOCK_NODE_ID, null, {
      title: 'Clock',
      key: 'clock',
      nodeType: 'custom',
      customNodeType: 'clock',
    })

    engine.addOptionNodes(
      CLOCK_NODE_ID,
      createClockOptionNodeConfigs({
        togglePlay: () => this.togglePlay(),
        reset: () => this.clock.reset(),
        tapTempo: () => this.clock.sendTempoTap(),
      }),
    )

    const bpmNode = engine.getNodeOptionNode(CLOCK_NODE_ID, 'globalClockBpm')

    this.unsubscribers.push(
      engine.subscribeToParamValue<number>(bpmNode.id, (bpm) => {
        if (isValidBpm(bpm)) {
          this.clock.bpm = bpm
        } else if (bpm !== undefined) {
          engine.setParamValue(bpmNode.id, this.clock.bpm)
        }
      }),
      this.clock.onBpmChange((bpm) => {
        engine.setParamValue(bpmNode.id, bpm)
      }),
    )
  }

  private togglePlay() {
    if (this.clock.isRunning) {
      this.clock.stop()
    } else {
      this.clock.start()
    }
  }

  update(_engine: HedronEngine, { deltaTime }: PluginUpdateArgs) {
    this.clock.step(deltaTime * 1000)
  }
}
