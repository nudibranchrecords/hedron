import { StoreApi } from 'zustand'
import { SketchNode, SketchModuleItem, SketchModules } from './SketchNode'
import { ConfigParam, ParamValue, ParamValues } from './ParamNode'
import { InputNode } from './InputNode'
import { ConfigShot } from './ShotNode'
import { Nodes } from './Node'
import { Resources } from './Resources'

export interface EngineData {
  nodes: Nodes
  paramValues: ParamValues
  resources: Resources
  sceneIds: string[]
}

interface AuxState {
  sketchModules: SketchModules
  resourcesUrl: string | null
}

export type EngineState = EngineData & AuxState

// TODO: Remove actions from store and onto engine
interface Actions {
  addScene: () => string
  addSketchToScene: (sceneId: string, moduleId: string) => string
  deleteScene: (sceneId: string) => void
  updateSketch: (instanceId: string, sketchState: Partial<SketchNode>) => void
  reconcileSketchNodes: (instanceId: string) => void
  moveSketchUp: (instanceId: string) => void
  moveSketchDown: (instanceId: string) => void
  setSketchModuleItem: (newItem: SketchModuleItem) => void
  updateParamValue: (paramId: string, value: ParamValue) => void
  updateMultipleParamValues: (paramIds: string[], values: ParamValue[]) => void
  deleteSketchModule: (moduleId: string) => void
  loadProject: (project: EngineData) => void
  reset: () => void
  addInput: (
    inputConfig: Omit<InputNode, 'id' | 'optionNodeIds' | 'childGroups' | 'nodeType'>,
    optionsNodeConfig?: readonly (ConfigParam | ConfigShot)[],
  ) => InputNode
  deleteNode: (nodeId: string) => void
}

export type EngineStateWithActions = EngineData & AuxState & Actions
export type UseEngineStore = <T>(selector?: (state: EngineStateWithActions) => T) => T

export type SetState = StoreApi<EngineStateWithActions>['setState']

// Matches immer middleware and devtools
export type CustomSetState = (
  cb: (draft: EngineStateWithActions) => void,
  replace?: false,
  name?: string,
) => void

export type SetterCreator<K extends keyof EngineStateWithActions> = (
  setState: CustomSetState,
) => EngineStateWithActions[K]
