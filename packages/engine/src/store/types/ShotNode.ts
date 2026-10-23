import { NodeBase, ConfigNodeBase } from './NodeBase'
import type { ShotArgsObject } from '@HedronEngine/types'

export type ShotFunc = (args: ShotArgsObject) => void | Promise<void>

export type ShotNode = NodeBase & {
  nodeType: 'shot'
  key: string
  hidden?: boolean
  groupIndex: number
}

export interface ConfigShot extends ConfigNodeBase {
  nodeType: 'shot'
  func?: ShotFunc
}

export interface ConfigShotImported extends Omit<ConfigShot, 'func'> {
  groupIndex: number
  title: string
  nodeType: 'shot'
}
