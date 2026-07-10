import { IPlugin } from '@hedron-gl/engine'
import { GamepadInputType, ButtonMode, AxisMode } from './GamepadTypes'

export const globalOptionNodesConfig = [
  {
    nodeType: 'param',
    key: 'axisSmoothing',
    title: 'Axis Smoothing',
    valueType: 'number',
    defaultValue: 0,
    sliderMin: 0,
    sliderMax: 0.99,
  },
  {
    nodeType: 'param',
    key: 'axisDeadZone',
    title: 'Axis Dead Zone',
    valueType: 'number',
    defaultValue: 0,
    sliderMin: 0,
    sliderMax: 0.5,
  },
  {
    nodeType: 'param',
    key: 'axisCap',
    title: 'Axis Cap',
    valueType: 'number',
    defaultValue: 1,
    sliderMin: 0,
    sliderMax: 1,
  },
  {
    nodeType: 'param',
    key: 'buttonSmoothing',
    title: 'Button Smoothing',
    valueType: 'number',
    defaultValue: 0,
    sliderMin: 0,
    sliderMax: 0.99,
  },
] as const satisfies IPlugin['globalOptionNodesConfig']

export const optionNodesConfig = [
  {
    nodeType: 'param',
    key: 'isEnabled',
    title: 'Enabled',
    valueType: 'boolean',
    defaultValue: true,
  },
  {
    nodeType: 'param',
    key: 'controllerIndex',
    valueType: 'enum',
    options: Array.from({ length: 4 }, (_, i) => ({ value: i, label: `Controller ${i + 1}` })),
    defaultValue: 0,
  },
  {
    nodeType: 'param',
    key: 'inputType',
    valueType: 'enum',
    options: [
      { value: GamepadInputType.Button, label: 'Button' },
      { value: GamepadInputType.Axis, label: 'Axis' },
    ],
    defaultValue: GamepadInputType.Button,
  },
  {
    nodeType: 'param',
    key: 'index',
    valueType: 'enum',
    options: Array.from({ length: 20 }, (_, i) => ({ value: i, label: `${i}` })),
    defaultValue: 0,
  },
  {
    nodeType: 'param',
    key: 'secondaryIndex',
    title: 'Secondary Index',
    valueType: 'enum',
    options: Array.from({ length: 20 }, (_, i) => ({ value: i, label: `${i}` })),
    defaultValue: 1,
  },
  {
    nodeType: 'param',
    key: 'triggerOn',
    valueType: 'enum',
    options: [
      { value: 'down', label: 'On Press' },
      { value: 'up', label: 'On Release' },
    ],
    defaultValue: 'down',
  },
  {
    nodeType: 'param',
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
    nodeType: 'param',
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
    nodeType: 'param',
    key: 'gateButtonIndex',
    title: 'Gate Button',
    valueType: 'enum',
    options: [
      { value: -1, label: 'None' },
      ...Array.from({ length: 20 }, (_, i) => ({ value: i, label: `${i}` })),
    ],
    defaultValue: -1,
  },
  {
    nodeType: 'param',
    key: 'angleOffset',
    title: 'Angle Offset',
    valueType: 'number',
    defaultValue: 0,
    sliderMin: 0,
    sliderMax: 1,
  },
] as const satisfies IPlugin['optionNodesConfig']
