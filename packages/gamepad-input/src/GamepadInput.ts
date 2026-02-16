import {
  HedronEngine,
  IPlugin,
  handleEachInput,
  EngineStore,
  NodeParamEnum,
  NodeParamBoolean,
  NodeParamNumber,
  NodeParamString,
  NodeParamRGB,
  NodeParamVector3,
} from '@hedron-gl/engine'
import { GamepadManager } from './GamepadManager'
import { GamepadEvent, GamepadInputType, AxisMode, ValueHander, ShotHandler } from './GamepadTypes'
import { globalOptionNodesConfig, optionNodesConfig } from './GamepadConfig'
import { createGamepadHandlers, applySmoothing, calculate2AxisValue } from './GamepadHandlers'

/**
 * Plugin to handle gamepad input devices.
 */
export class GamepadInput implements IPlugin {
  public readonly id = 'gamepad-input'
  public readonly name = 'Gamepad Input'
  public readonly inputType = 'gamepad'
  public readonly description = 'Handles gamepad input devices.'
  public readonly gamepadManager = new GamepadManager()
  public readonly globalOptionNodesConfig = globalOptionNodesConfig
  public readonly optionNodesConfig = optionNodesConfig

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
   * Tracks button states for each controller to support gated axis mode
   */
  private buttonStates = new Map<string, boolean>()

  /**
   * Handlers for each input type
   */
  public handlers: {
    handleShot: ShotHandler
    enum: ValueHander<NodeParamEnum>
    boolean: ValueHander<NodeParamBoolean>
    number: ValueHander<NodeParamNumber>
    string: ValueHander<NodeParamString>
    rgb: ValueHander<NodeParamRGB>
    vector3: ValueHander<NodeParamVector3>
  }

  constructor(engine: HedronEngine) {
    this.store = engine.getStore()
    this.engine = engine

    // Create handlers with access to necessary state
    const baseHandlers = createGamepadHandlers({
      toggleStates: this.toggleStates,
      primaryAxisValues: this.primaryAxisValues,
      secondaryAxisValues: this.secondaryAxisValues,
    })

    this.handlers = {
      handleShot: baseHandlers.handleShot,
      enum: baseHandlers.handleEnum,
      boolean: baseHandlers.handleBoolean,
      number: baseHandlers.handleNumber,
      string: baseHandlers.handleUnsupportedString,
      rgb: baseHandlers.handleUnsupportedRGB,
      vector3: baseHandlers.handleUnsupportedVector3,
    }

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
    // Track button states for gated axis mode (track ALL button events)
    if (event.inputType === GamepadInputType.Button) {
      const buttonKey = `${event.controllerIndex}-${event.index}`
      this.buttonStates.set(buttonKey, event.isPressed ?? false)
    }

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

        // For gated axis mode, check if gate button is pressed
        if (optionNodes.inputType === GamepadInputType.Axis && optionNodes.gateButtonIndex !== -1) {
          const gateButtonKey = `${optionNodes.controllerIndex}-${optionNodes.gateButtonIndex}`
          const isGatePressed = this.buttonStates.get(gateButtonKey) ?? false
          if (!isGatePressed) return // Don't update if gate button isn't pressed
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
            const combinedValue = calculate2AxisValue(
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
            this.handlers.handleShot({
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
          // @ts-expect-error - TS can't infer that handler matches node type
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
          finalValue = applySmoothing(currentValue, targetValue, smoothing, isAngle)
        }

        // Update the node value
        storeState.updateNodeValue(input.targetNodeId, finalValue)
      },
    )
  }
}
