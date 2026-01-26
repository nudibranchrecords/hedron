import {
  getNextEnumValue,
  HedronEngine,
  InputOptionNodesConfig,
  IPlugin,
  handleEachInput,
  NodeParamEnum,
  EngineStore,
} from '@hedron/engine'
import { GamepadManager } from './GamepadManager'
import { GamepadEvent, GamepadInputType, ShotHandler, ValueHander } from './GamepadTypes'

/**
 * Plugin to handle gamepad input devices.
 */
export class GamepadInput implements IPlugin {
  public readonly id = 'gamepad-input'
  public readonly name = 'Gamepad Input'
  public readonly inputType = 'gamepad'
  public readonly description = 'Handles gamepad input devices.'
  public readonly gamepadManager = new GamepadManager()
  public readonly optionNodesConfig = [
    {
      key: 'controllerIndex',
      valueType: 'enum',
      options: Array.from({ length: 4 }, (_, i) => ({ value: i, label: `Controller ${i + 1}` })),
      defaultValue: 0,
    },
    {
      key: 'inputType',
      valueType: 'enum',
      options: [
        { value: GamepadInputType.Button, label: 'Button' },
        { value: GamepadInputType.Axis, label: 'Axis' },
      ],
      defaultValue: GamepadInputType.Button,
    },
    {
      key: 'index',
      valueType: 'enum',
      options: Array.from({ length: 20 }, (_, i) => ({ value: i, label: `${i}` })),
      defaultValue: 0,
    },
    {
      key: 'triggerOn',
      valueType: 'enum',
      options: [
        { value: 'down', label: 'On Press' },
        { value: 'up', label: 'On Release' },
      ],
      defaultValue: 'down',
    },
  ] as const satisfies InputOptionNodesConfig

  /**
   * Handles shot inputs from gamepad events.
   */
  private handleShot: ShotHandler = ({ input, engine, gamepadEvent, optionNodes }) => {
    // Only fire shot on the configured trigger event
    if (gamepadEvent.inputType === GamepadInputType.Button) {
      const shouldTrigger =
        (optionNodes.triggerOn === 'down' && gamepadEvent.isPressed) ||
        (optionNodes.triggerOn === 'up' && !gamepadEvent.isPressed)
      if (!shouldTrigger) return
    }
    engine.fireShot(input.targetNodeId, { _gamepadEvent: gamepadEvent })
  }

  /**
   * Handles enum inputs from gamepad events.
   */
  private handleEnum: ValueHander<NodeParamEnum> = ({
    gamepadEvent,
    input,
    storeState,
    targetNode,
    optionNodes,
  }) => {
    // For buttons, cycle through enum values; for axes, map to enum range
    if (optionNodes.inputType === GamepadInputType.Button) {
      const shouldTrigger =
        (optionNodes.triggerOn === 'down' && gamepadEvent.isPressed) ||
        (optionNodes.triggerOn === 'up' && !gamepadEvent.isPressed)
      if (!shouldTrigger) return null

      return getNextEnumValue(input.targetNodeId)(storeState)
    } else {
      return targetNode.options[Math.floor(gamepadEvent.value * (targetNode.options.length - 1))]
        .value
    }
  }

  /**
   * Handles boolean inputs from gamepad events.
   */
  private handleBoolean: ValueHander = ({ gamepadEvent, targetNodeValue, optionNodes }) => {
    if (optionNodes.inputType === GamepadInputType.Button) {
      const shouldTrigger =
        (optionNodes.triggerOn === 'down' && gamepadEvent.isPressed) ||
        (optionNodes.triggerOn === 'up' && !gamepadEvent.isPressed)
      if (!shouldTrigger) return null

      return !targetNodeValue
    } else {
      return gamepadEvent.value > 0.5
    }
  }

  /**
   * Handles number inputs from gamepad events.
   */
  private handleNumber: ValueHander = ({ gamepadEvent, storeState, input }) => {
    const sliderMin = (storeState.nodeValues[`${input.targetNodeId}-sliderMin`] as number) ?? 0
    const sliderMax = (storeState.nodeValues[`${input.targetNodeId}-sliderMax`] as number) ?? 1

    return gamepadEvent.value * (sliderMax - sliderMin) + sliderMin
  }

  /**
   * Handles unsupported value types from gamepad events, logging a warning.
   */
  private handleUnsupported: ValueHander = ({ input, targetNode, gamepadEvent }) => {
    console.warn(
      `Gamepad Input: Unsupported value type for node ${input.targetNodeId}. Value: ${gamepadEvent.value}, Type: ${targetNode.valueType}`,
    )

    return null
  }
  store: EngineStore
  engine: HedronEngine
  handlers = {
    enum: this.handleEnum,
    boolean: this.handleBoolean,
    number: this.handleNumber,
    string: this.handleUnsupported,
    rgb: this.handleUnsupported,
    vector3: this.handleUnsupported,
  }

  constructor(engine: HedronEngine) {
    this.store = engine.getStore()
    this.engine = engine

    this.gamepadManager.onGamepadEvent.add(this.handleGamepadEvent.bind(this))
  }

  /**
   * Updates the engine state based on a gamepad event.
   * @param event The gamepad event data.
   */
  private handleGamepadEvent(event: GamepadEvent): void {
    const storeState = this.store.getState()
    handleEachInput<typeof this.optionNodesConfig>(
      storeState,
      'gamepad',
      ({ input, optionNodes, targetNode, targetNodeValue }) => {
        if (
          event.controllerIndex === optionNodes.controllerIndex &&
          event.inputType === optionNodes.inputType &&
          event.index === optionNodes.index
        ) {
          if (targetNode.nodeType === 'shot') {
            this.handleShot({ input, engine: this.engine, gamepadEvent: event, optionNodes })
            return
          }

          const value = this.handlers[targetNode.valueType]({
            gamepadEvent: event,
            input,
            storeState,
            optionNodes,
            // @ts-expect-error -- TS isn't smart enough to infer the correct node type
            targetNode,
            targetNodeValue,
          })

          if (value === null) {
            return
          }

          storeState.updateNodeValue(input.targetNodeId, value)
        }
      },
    )
  }
}
