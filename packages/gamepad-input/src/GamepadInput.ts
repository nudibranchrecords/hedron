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
import {
  GamepadEvent,
  GamepadInputType,
  ShotHandler,
  ValueHander,
  ButtonMode,
  AxisMode,
} from './GamepadTypes'

/**
 * Plugin to handle gamepad input devices.
 */
export class GamepadInput implements IPlugin {
  public readonly id = 'gamepad-input'
  public readonly name = 'Gamepad Input'
  public readonly inputType = 'gamepad'
  public readonly description = 'Handles gamepad input devices.'
  public readonly gamepadManager = new GamepadManager()
  public readonly globalOptionNodesConfig = [
    {
      key: 'axisSmoothing',
      title: 'Axis Smoothing',
      valueType: 'number',
      defaultValue: 0,
      sliderMin: 0,
      sliderMax: 0.99,
    },
    {
      key: 'buttonSmoothing',
      title: 'Button Smoothing',
      valueType: 'number',
      defaultValue: 0,
      sliderMin: 0,
      sliderMax: 0.99,
    },
    {
      key: 'axisDeadZone',
      title: 'Axis Dead Zone',
      valueType: 'number',
      defaultValue: 0,
      sliderMin: 0,
      sliderMax: 0.5,
    },
    {
      key: 'axisCap',
      title: 'Axis Cap',
      valueType: 'number',
      defaultValue: 1,
      sliderMin: 0,
      sliderMax: 1,
    },
  ] as const satisfies InputOptionNodesConfig
  public readonly optionNodesConfig = [
    {
      key: 'isEnabled',
      title: 'Enabled',
      valueType: 'boolean',
      defaultValue: true,
    },
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
      key: 'secondaryIndex',
      title: 'Secondary Index',
      valueType: 'enum',
      options: Array.from({ length: 20 }, (_, i) => ({ value: i, label: `${i}` })),
      defaultValue: 1,
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
    {
      key: 'buttonMode',
      title: 'Button Mode',
      valueType: 'enum',
      options: [
        { value: ButtonMode.Hold, label: 'Hold' },
        { value: ButtonMode.Toggle, label: 'Toggle' },
      ],
      defaultValue: ButtonMode.Hold,
    },
    {
      key: 'axisMode',
      title: 'Axis Mode',
      valueType: 'enum',
      options: [
        { value: AxisMode.Single, label: 'Single Axis' },
        { value: AxisMode.Angle, label: '2 Axis as Angle' },
        { value: AxisMode.Distance, label: '2 Axis as Distance' },
      ],
      defaultValue: AxisMode.Single,
    },
    {
      key: 'angleOffset',
      title: 'Angle Offset',
      valueType: 'number',
      defaultValue: 0,
      sliderMin: 0,
      sliderMax: 1,
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
   * Calculates the combined value for 2-axis modes.
   */
  private calculate2AxisValue(
    primaryValue: number,
    secondaryValue: number,
    mode: AxisMode,
    angleOffset: number,
  ): number {
    // Convert from [0, 1] to [-1, 1] for calculation
    const x = primaryValue * 2 - 1
    const y = secondaryValue * 2 - 1

    if (mode === AxisMode.Angle) {
      // Calculate angle using atan2, normalize to [0, 1]
      const angle = Math.atan2(y, x)
      const normalizedAngle = (angle + Math.PI) / (2 * Math.PI)
      // Apply angle offset (wrapping around)
      return (normalizedAngle + angleOffset) % 1
    } else if (mode === AxisMode.Distance) {
      // Calculate distance from origin, clamp to [0, 1]
      const distance = Math.sqrt(x * x + y * y)
      return Math.min(1, distance)
    }

    // Default to primary value
    return primaryValue
  }

  /**
   * Handles number inputs from gamepad events.
   */
  private handleNumber: ValueHander = ({ gamepadEvent, storeState, input, optionNodes }) => {
    const sliderMin = (storeState.nodeValues[`${input.targetNodeId}-sliderMin`] as number) ?? 0
    const sliderMax = (storeState.nodeValues[`${input.targetNodeId}-sliderMax`] as number) ?? 1

    // For button inputs, check if toggle mode is enabled
    if (
      optionNodes.inputType === GamepadInputType.Button &&
      optionNodes.buttonMode === ButtonMode.Toggle
    ) {
      // Only toggle on button down
      const shouldTrigger =
        (optionNodes.triggerOn === 'down' && gamepadEvent.isPressed) ||
        (optionNodes.triggerOn === 'up' && !gamepadEvent.isPressed)

      if (!shouldTrigger) return null

      // Toggle the state
      const currentToggleState = this.toggleStates.get(input.id) ?? false
      const newToggleState = !currentToggleState
      this.toggleStates.set(input.id, newToggleState)

      // Return max if toggled on, min if toggled off
      return newToggleState ? sliderMax : sliderMin
    }

    // For axis inputs in 2-axis mode, use the combined value
    let finalValue = gamepadEvent.value
    if (
      optionNodes.inputType === GamepadInputType.Axis &&
      optionNodes.axisMode !== AxisMode.Single
    ) {
      const primaryValue = this.primaryAxisValues.get(input.id) ?? 0.5
      const secondaryValue = this.secondaryAxisValues.get(input.id) ?? 0.5
      finalValue = this.calculate2AxisValue(
        primaryValue,
        secondaryValue,
        optionNodes.axisMode,
        optionNodes.angleOffset,
      )
    }

    // Default behavior: map value to slider range
    return finalValue * (sliderMax - sliderMin) + sliderMin
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
  /**
   * Tracks target values from gamepad events for each input
   */
  private targetValues = new Map<string, number>()
  /**
   * Tracks toggle state for button inputs in toggle mode
   */
  private toggleStates = new Map<string, boolean>()
  /**
   * Tracks previous smoothed values for each input target node
   */
  private previousValues = new Map<string, number>()
  /**
   * Tracks raw primary axis values for each input (before 2-axis calculation)
   */
  private primaryAxisValues = new Map<string, number>()
  /**
   * Tracks raw secondary axis values for each input (for 2-axis modes)
   */
  private secondaryAxisValues = new Map<string, number>()
  /**
   * Tracks the axis mode for each input (for proper smoothing)
   */
  private inputAxisModes = new Map<string, AxisMode>()

  /**
   * Handlers for each input type
   */
  public handlers = {
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

    // Start the update loop
    window.requestAnimationFrame(() => this.update())
  }

  /**
   * Gets the axis smoothing value from the global options
   * @returns Axis smoothing value (default: 0)
   */
  private getAxisSmoothing(): number {
    const storeState = this.store.getState()
    const nodeId = `${this.id}-global-axisSmoothing`
    const value = storeState.nodeValues[nodeId] as number | undefined
    return value ?? 0
  }

  /**
   * Gets the button smoothing value from the global options
   * @returns Button smoothing value (default: 0)
   */
  private getButtonSmoothing(): number {
    const storeState = this.store.getState()
    const nodeId = `${this.id}-global-buttonSmoothing`
    const value = storeState.nodeValues[nodeId] as number | undefined
    return value ?? 0
  }

  /**
   * Gets the axis dead zone value from the global options
   * @returns Axis dead zone value (default: 0)
   */
  private getAxisDeadZone(): number {
    const storeState = this.store.getState()
    const nodeId = `${this.id}-global-axisDeadZone`
    const value = storeState.nodeValues[nodeId] as number | undefined
    return value ?? 0
  }

  /**
   * Gets the axis cap value from the global options
   * @returns Axis cap value (default: 1)
   */
  private getAxisCap(): number {
    const storeState = this.store.getState()
    const nodeId = `${this.id}-global-axisCap`
    const value = storeState.nodeValues[nodeId] as number | undefined
    return value ?? 1
  }

  /**
   * Applies dead zone and axis cap to a raw axis value.
   * @param rawValue The raw axis value in range [0, 1] where 0.5 is center
   * @returns The processed value with dead zone and cap applied
   */
  private applyAxisDeadZoneAndCap(rawValue: number): number {
    const deadZone = this.getAxisDeadZone()
    const cap = this.getAxisCap()

    // Convert to distance from center [-1, 1]
    const centered = (rawValue - 0.5) * 2
    const distance = Math.abs(centered)
    const sign = Math.sign(centered)

    // Apply dead zone
    if (distance < deadZone) {
      return 0.5 // Return to center
    }

    // Remap from [deadZone, cap] to [0, 1] and clamp
    const remapped = (distance - deadZone) / (cap - deadZone)
    const clamped = Math.min(1, Math.max(0, remapped))

    // Convert back to [0, 1] range
    return 0.5 + (clamped * sign) / 2
  }

  /**
   * Updates the engine state based on a gamepad event.
   * Stores target values for smoothing in the update loop.
   * @param event The gamepad event data.
   */
  private handleGamepadEvent(event: GamepadEvent): void {
    const storeState = this.store.getState()
    handleEachInput<typeof this.optionNodesConfig>(
      storeState,
      'gamepad',
      ({ input, optionNodes, targetNode, targetNodeValue }) => {
        // Skip if input is disabled
        if (!optionNodes.isEnabled) return

        // Check if this event matches the controller and input type
        if (event.controllerIndex !== optionNodes.controllerIndex) return
        if (event.inputType !== optionNodes.inputType) return

        // Check if this event is for the primary or secondary axis
        const isPrimaryAxis = event.index === optionNodes.index
        const isSecondaryAxis =
          optionNodes.inputType === GamepadInputType.Axis &&
          optionNodes.axisMode !== 'single' &&
          event.index === optionNodes.secondaryIndex

        if (!isPrimaryAxis && !isSecondaryAxis) return

        // Apply dead zone and axis cap to axis values
        let processedValue = event.value
        if (event.inputType === GamepadInputType.Axis) {
          processedValue = this.applyAxisDeadZoneAndCap(event.value)
        }

        // For axis inputs in 2-axis mode, update the raw axis values
        if (
          optionNodes.inputType === GamepadInputType.Axis &&
          optionNodes.axisMode !== AxisMode.Single
        ) {
          // Track the axis mode for this input
          this.inputAxisModes.set(input.id, optionNodes.axisMode)

          if (isPrimaryAxis) {
            this.primaryAxisValues.set(input.id, processedValue)
          } else if (isSecondaryAxis) {
            this.secondaryAxisValues.set(input.id, processedValue)
          }

          // For number types, recalculate the combined value when either axis changes
          if (targetNode.nodeType === 'param' && targetNode.valueType === 'number') {
            const primaryValue = this.primaryAxisValues.get(input.id) ?? 0.5
            const secondaryValue = this.secondaryAxisValues.get(input.id) ?? 0.5
            const combinedValue = this.calculate2AxisValue(
              primaryValue,
              secondaryValue,
              optionNodes.axisMode,
              optionNodes.angleOffset,
            )

            const sliderMin =
              (storeState.nodeValues[`${input.targetNodeId}-sliderMin`] as number) ?? 0
            const sliderMax =
              (storeState.nodeValues[`${input.targetNodeId}-sliderMax`] as number) ?? 1
            const scaledValue = combinedValue * (sliderMax - sliderMin) + sliderMin

            this.targetValues.set(input.id, scaledValue)
          }

          // For 2-axis mode, we handle the update above, so return early
          return
        } else if (optionNodes.inputType === GamepadInputType.Axis) {
          // For single-axis mode, clear the axis mode tracking
          this.inputAxisModes.delete(input.id)
        }

        // Handle shots
        if (targetNode.nodeType === 'shot') {
          if (isPrimaryAxis) {
            // Use processed value for shots as well
            const processedEvent = { ...event, value: processedValue }
            this.handleShot({
              input,
              engine: this.engine,
              gamepadEvent: processedEvent,
              optionNodes,
            })
          }
          return
        }

        // Only process primary axis for value updates (secondary is handled via raw values)
        if (!isPrimaryAxis) return

        // Create modified event with processed value for handlers
        const processedEvent = { ...event, value: processedValue }

        const value = this.handlers[targetNode.valueType]({
          gamepadEvent: processedEvent,
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

        // Store the target value for smoothing in the update loop (only for numbers)
        if (targetNode.valueType === 'number' && typeof value === 'number') {
          this.targetValues.set(input.id, value)
        } else {
          // For non-number types, update directly
          storeState.updateNodeValue(input.targetNodeId, value)
        }
      },
    )
  }

  /**
   * Updates gamepad input values on each frame.
   * Applies smoothing by lerping towards target values.
   */
  public update() {
    this.updateInputNodes()

    // Schedule next update
    window.requestAnimationFrame(() => this.update())
  }

  /**
   * Applies smoothing with special handling for angle wrapping.
   * @param currentValue The current smoothed value
   * @param targetValue The target value to smooth towards
   * @param smoothing The smoothing factor (0 = no smoothing, 1 = max smoothing)
   * @param isAngle Whether this is an angle value that needs wrap-around handling
   * @returns The smoothed value
   */
  private applySmoothing(
    currentValue: number,
    targetValue: number,
    smoothing: number,
    isAngle: boolean = false,
  ): number {
    if (!isAngle) {
      // Standard linear interpolation
      return currentValue * smoothing + targetValue * (1 - smoothing)
    }

    // For angles, handle wrap-around
    let delta = targetValue - currentValue

    // Normalize delta to [-0.5, 0.5] to take the shortest path
    if (delta > 0.5) {
      delta -= 1
    } else if (delta < -0.5) {
      delta += 1
    }

    // Apply smoothing to the delta
    const smoothedDelta = delta * (1 - smoothing)
    let result = currentValue + smoothedDelta

    // Wrap result to [0, 1]
    if (result < 0) result += 1
    if (result >= 1) result -= 1

    return result
  }

  /**
   * Updates input node values by lerping towards target values.
   * Called each frame from the main update loop.
   */
  private updateInputNodes() {
    const storeState = this.store.getState()
    handleEachInput<typeof this.optionNodesConfig>(
      storeState,
      'gamepad',
      ({ input, optionNodes, targetNode }) => {
        // Skip if input is disabled
        if (!optionNodes.isEnabled) return

        if (targetNode.nodeType === 'shot') return
        if (targetNode.valueType !== 'number') return

        // Get the target value (if no event has occurred, don't update)
        const targetValue = this.targetValues.get(input.id)
        if (targetValue === undefined) return

        // Get current value from store
        const currentValue = storeState.nodeValues[input.targetNodeId] as number | undefined

        // Determine smoothing based on input type
        let smoothing = 0
        if (optionNodes.inputType === GamepadInputType.Axis) {
          smoothing = this.getAxisSmoothing()
        } else if (optionNodes.inputType === GamepadInputType.Button) {
          smoothing = this.getButtonSmoothing()
        }

        // Apply smoothing if enabled
        let finalValue = targetValue
        if (smoothing > 0 && currentValue !== undefined) {
          // Check if this is an angle mode input
          const axisMode = this.inputAxisModes.get(input.id)
          const isAngle = axisMode === AxisMode.Angle
          finalValue = this.applySmoothing(currentValue, targetValue, smoothing, isAngle)
        }

        // Update the node value
        storeState.updateNodeValue(input.targetNodeId, finalValue)
      },
    )
  }
}
