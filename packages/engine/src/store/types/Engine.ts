import { StoreApi } from 'zustand'
import { Sketch, Sketches, SketchModuleItem, SketchModules } from './Sketch'
import { ConfigParam, ParamValue, ParamValues } from './Param'
import { Input } from './Input'
import { ConfigShot } from './Shot'
import { Nodes } from './Node'

export interface EngineData {
  sketches: Sketches
  nodes: Nodes
  paramValues: ParamValues
}

interface AuxState {
  sketchModules: SketchModules
}

export type EngineState = EngineData & AuxState

// TODO: Remove actions from store and onto engine
interface Actions {
  addSketch: (moduleId: string) => string
  updateSketch: (instanceId: string, sketchState: Partial<Sketch>) => void
  reconcileSketchNodes: (instanceId: string) => void
  deleteSketch: (instanceId: string) => void
  moveSketchUp: (instanceId: string) => void
  moveSketchDown: (instanceId: string) => void
  setSketchModuleItem: (newItem: SketchModuleItem) => void
  updateParamValue: (paramId: string, value: ParamValue) => void
  updateMultipleParamValues: (paramIds: string[], values: ParamValue[]) => void
  deleteSketchModule: (moduleId: string) => void
  loadProject: (project: EngineData) => void
  reset: () => void
  addInput: (
    inputConfig: Omit<Input, 'id' | 'optionNodeIds' | 'childGroups' | 'nodeType'>,
    optionsNodeConfig?: (ConfigParam | ConfigShot)[],
  ) => string
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
