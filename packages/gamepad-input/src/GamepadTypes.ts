import {
  ConfigToOptionsType,
  EngineState,
  HedronEngine,
  Input,
  NodeValue,
  Param,
} from '@hedron/engine'
import { GamepadInput } from './GamepadInput'

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
export type ValueHander<T = Param> = (params: {
  gamepadEvent: GamepadEvent
  input: Input
  storeState: EngineState
  optionNodes: ConfigToOptionsType<typeof GamepadInput.prototype.optionNodesConfig>
  targetNode: T
  targetNodeValue: NodeValue
}) => NodeValue | null

/**
 * Type for shot handler functions.
 */
export type ShotHandler = (params: {
  input: Input
  engine: HedronEngine
  gamepadEvent: GamepadEvent
  optionNodes: ConfigToOptionsType<typeof GamepadInput.prototype.optionNodesConfig>
}) => void
