import {
  getNextEnumValue,
  NodeParamEnum,
  NodeParamBoolean,
  NodeParamNumber,
  NodeParamString,
  NodeParamRGB,
  NodeParamVector3,
  NodeParamVector2,
} from '@hedron-gl/engine'
import {
  GamepadInputType,
  ShotHandler,
  ValueHandler as ValueHandler,
  ButtonMode,
  AxisMode,
} from './GamepadTypes'

/**
 * Calculates the combined value for 2-axis modes.
 */
export function calculate2AxisValue(
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
 * Applies smoothing with special handling for angle wrapping.
 * @param currentValue The current smoothed value
 * @param targetValue The target value to smooth towards
 * @param smoothing The smoothing factor (0 = no smoothing, 1 = max smoothing)
 * @param isAngle Whether this is an angle value that needs wrap-around handling
 * @returns The smoothed value
 */
export function applySmoothing(
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
 * Creates gamepad input handlers with access to necessary state.
 */
export function createGamepadHandlers(dependencies: {
  toggleStates: Map<string, boolean>
  primaryAxisValues: Map<string, number>
  secondaryAxisValues: Map<string, number>
}) {
  const { toggleStates, primaryAxisValues, secondaryAxisValues } = dependencies

  /**
   * Handles shot inputs from gamepad events.
   */
  const handleShot: ShotHandler = ({ input, engine, gamepadEvent, optionNodes }) => {
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
  const handleEnum: ValueHandler<NodeParamEnum> = ({
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
  const handleBoolean: ValueHandler<NodeParamBoolean> = ({
    gamepadEvent,
    targetNodeValue,
    optionNodes,
  }) => {
    if (optionNodes.inputType === GamepadInputType.Button) {
      // For toggle mode, toggle the state on trigger event
      if (optionNodes.buttonMode === ButtonMode.Toggle) {
        const shouldTrigger =
          (optionNodes.triggerOn === 'down' && gamepadEvent.isPressed) ||
          (optionNodes.triggerOn === 'up' && !gamepadEvent.isPressed)
        if (!shouldTrigger) return null

        return !targetNodeValue
      }

      // For hold mode, follow the button state
      if (optionNodes.triggerOn === 'down') {
        // On press: true, on release: false
        return gamepadEvent.isPressed ?? false
      } else {
        // On release: true, on press: false (inverted)
        return !(gamepadEvent.isPressed ?? true)
      }
    } else {
      return gamepadEvent.value > 0.5
    }
  }

  /**
   * Handles number inputs from gamepad events.
   */
  const handleNumber: ValueHandler<NodeParamNumber> = ({
    gamepadEvent,
    storeState,
    input,
    optionNodes,
  }) => {
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
      const currentToggleState = toggleStates.get(input.id) ?? false
      const newToggleState = !currentToggleState
      toggleStates.set(input.id, newToggleState)

      // Return max if toggled on, min if toggled off
      return newToggleState ? sliderMax : sliderMin
    }

    // For axis inputs in 2-axis mode, use the combined value
    let finalValue = gamepadEvent.value
    if (
      optionNodes.inputType === GamepadInputType.Axis &&
      optionNodes.axisMode !== AxisMode.Single
    ) {
      const primaryValue = primaryAxisValues.get(input.id) ?? 0.5
      const secondaryValue = secondaryAxisValues.get(input.id) ?? 0.5
      finalValue = calculate2AxisValue(
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
   * Handles unsupported string value types from gamepad events, logging a warning.
   */
  const handleUnsupportedString: ValueHandler<NodeParamString> = ({
    input,
    targetNode,
    gamepadEvent,
  }) => {
    console.warn(
      `Gamepad Input: Unsupported value type for node ${input.targetNodeId}. Value: ${gamepadEvent.value}, Type: ${targetNode.valueType}`,
    )

    return null
  }

  /**
   * Handles unsupported RGB value types from gamepad events, logging a warning.
   */
  const handleUnsupportedRGB: ValueHandler<NodeParamRGB> = ({
    input,
    targetNode,
    gamepadEvent,
  }) => {
    console.warn(
      `Gamepad Input: Unsupported value type for node ${input.targetNodeId}. Value: ${gamepadEvent.value}, Type: ${targetNode.valueType}`,
    )

    return null
  }

  /**
   * Handles unsupported Vector3 value types from gamepad events, logging a warning.
   */
  const handleUnsupportedVector2: ValueHandler<NodeParamVector2> = ({
    input,
    targetNode,
    gamepadEvent,
  }) => {
    console.warn(
      `Gamepad Input: Unsupported value type for node ${input.targetNodeId}. Value: ${gamepadEvent.value}, Type: ${targetNode.valueType}`,
    )

    return null
  }

  /**
   * Handles unsupported Vector3 value types from gamepad events, logging a warning.
   */
  const handleUnsupportedVector3: ValueHandler<NodeParamVector3> = ({
    input,
    targetNode,
    gamepadEvent,
  }) => {
    console.warn(
      `Gamepad Input: Unsupported value type for node ${input.targetNodeId}. Value: ${gamepadEvent.value}, Type: ${targetNode.valueType}`,
    )

    return null
  }

  return {
    handleShot,
    handleEnum,
    handleBoolean,
    handleNumber,
    handleUnsupportedString,
    handleUnsupportedRGB,
    handleUnsupportedVector2,
    handleUnsupportedVector3,
  }
}
