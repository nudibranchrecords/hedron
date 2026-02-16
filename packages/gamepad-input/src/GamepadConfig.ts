import { InputOptionNodesConfig } from '@hedron-gl/engine'
import { GamepadInputType, ButtonMode, AxisMode } from './GamepadTypes'

export const globalOptionNodesConfig = [
  {
    key: 'axisSmoothing',
    title: 'Axis Smoothing',
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
  {
    key: 'buttonSmoothing',
    title: 'Button Smoothing',
    valueType: 'number',
    defaultValue: 0,
    sliderMin: 0,
    sliderMax: 0.99,
  },
] as const satisfies InputOptionNodesConfig

export const optionNodesConfig = [
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
