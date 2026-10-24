import {
  ConfigToOptionsType,
  EngineState,
  HedronEngine,
  InputNode,
  ParamValue,
  ParamNode,
} from '@hedron-gl/engine'
import type { GAMEPAD_OPTION_NODE_CONFIGS } from './GamepadConfig'

/**
 * Enum for the types of gamepad inputs.
 */
export enum GamepadInputType {
  Button = 'button',
  Axis = 'axis',
}

/**
 * Enum for button input modes.
 */
export enum ButtonMode {
  Hold = 'hold',
  Toggle = 'toggle',
}

/**
 * Enum for axis input modes.
 */
export enum AxisMode {
  Single = 'single',
  Angle = 'angle',
  Distance = 'distance',
}

/**
 * Interface for gamepad event data.
 */
export interface GamepadEvent {
  controllerIndex: number
  inputType: GamepadInputType
  index: number
  value: number
  isPressed?: boolean // Only for buttons
  secondaryIndex?: number // For 2-axis modes
}

/**
 * Type for value handler functions.
 */
export type ValueHandler<T = ParamNode> = (params: {
  gamepadEvent: GamepadEvent
  input: InputNode
  storeState: EngineState
  optionNodes: ConfigToOptionsType<typeof GAMEPAD_OPTION_NODE_CONFIGS>
  targetNode: T
  targetParamValue: ParamValue
}) => ParamValue | null

/**
 * Type for shot handler functions.
 */
export type ShotHandler = (params: {
  input: InputNode
  engine: HedronEngine
  gamepadEvent: GamepadEvent
  optionNodes: ConfigToOptionsType<typeof GAMEPAD_OPTION_NODE_CONFIGS>
}) => void
