import { type ShaderNodeObject } from 'three/tsl'
import { Group } from 'three'
import { Pass } from 'postprocessing'
import { PassNode } from 'three/webgpu'
import { ConfigParam, ConfigParamImported, ConfigParamNumber } from './Param'
import { ConfigShot, ConfigShotImported } from './Shot'
import { EngineScene } from '@world/EngineScene'
import { ShotArgsObject } from '@HedronEngine/types'

type WithOptional<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, Extract<K, keyof T>> & Partial<Pick<T, Extract<K, keyof T>>>
  : never

type SketchConfigParamNumber = WithOptional<ConfigParamNumber, 'valueType'>

type SketchConfigParamBase = Exclude<ConfigParam, ConfigParamNumber> | SketchConfigParamNumber

export type SketchConfigParam = WithOptional<SketchConfigParamBase, 'nodeType'>

export type SketchConfigShot = WithOptional<ConfigShot, 'nodeType'>

interface ConfigParamGroup {
  groupTitle?: string
  params: SketchConfigParam[]
}

interface ConfigShotGroup {
  groupTitle?: string
  shots: SketchConfigShot[]
}

export interface ConfigSketch {
  title?: string
  description?: string
  params?: (SketchConfigParam | ConfigParamGroup)[]
  shots?: (SketchConfigShot | ConfigShotGroup)[]
}

export interface ConfigSketchImported {
  title: string
  description?: string
  nodes: (ConfigParamImported | ConfigShotImported)[]
  groupInfo: {
    groupTitle?: string
  }[]
}

// TODO: This will eventually become a node
export interface Sketch {
  id: string
  title: string
  moduleId: string
  nodeIds: string[]
  isBroken?: boolean
}

export type Sketches = { [key: string]: Sketch }

type SketchUpdateParams = {
  deltaFrame: number
  deltaTime: number
  params: { [key: string]: unknown }
  scene: EngineScene
}

type SketchShotFunc = (
  args: Omit<SketchUpdateParams, 'deltaFrame' | 'deltaTime'> & { shotArgs: ShotArgsObject },
) => void

export type SketchInstance = {
  id: string
  update: (arg: SketchUpdateParams) => void
  root?: Group

  getPasses?: (engineScene: EngineScene) => Pass[]

  getWebGPUPass?: (
    prevPass: ShaderNodeObject<PassNode>,
    renderPassNode: ShaderNodeObject<PassNode>,
  ) => ShaderNodeObject<PassNode>

  dispose(engineScene: EngineScene): () => void
} & Record<string, SketchShotFunc>

export type SketchInstanceMap = Map<string, SketchInstance>
export type SketchInstanceErrorType = 'Create' | 'Dispose'
export type SketchInstanceError = (
  sketchInstanceId: string,
  errorType?: SketchInstanceErrorType,
) => void

export type SketchModule = {
  new (scene: EngineScene): SketchInstance
  getConfig?: () => ConfigSketch
}

export interface SketchModuleItem {
  moduleId: string
  config: ConfigSketchImported
  module: SketchModule
}

export type SketchModules = { [key: string]: SketchModuleItem }
