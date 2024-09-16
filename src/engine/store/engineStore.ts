import { createStore, StoreApi } from 'zustand/vanilla'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import type {} from '@redux-devtools/extension' // required for devtools typing
import { Nodes, NodeValues, Sketches, SketchModuleItem, SketchModules } from './types'
import { createAddSketch } from './actionCreators/addSketch'
import { createSetSketchModuleItem } from './actionCreators/setSketchModuleItem'
import { createUpdateNodeValue } from './actionCreators/updateNodeValue'
import { createDeleteSketchModule } from './actionCreators/deleteSketchModule'
import { createDeleteSketch } from './actionCreators/deleteSketch'

export interface EngineState {
  sketchModules: SketchModules
  isSketchModulesReady: boolean
  sketches: Sketches
  nodes: Nodes
  nodeValues: NodeValues
  addSketch: (moduleId: string) => string
  deleteSketch: (instanceId: string) => void
  setSketchModuleItem: (newItem: SketchModuleItem) => void
  updateNodeValue: (nodeId: string, value: number) => void
  deleteSketchModule: (moduleId: string) => void
}

export type SetState = StoreApi<EngineState>['setState']

// Matches immer middleware and devtools
export type CustomSetState = (
  cb: (draft: EngineState) => void,
  replace?: boolean,
  name?: string,
) => void

export type SetterCreator<K extends keyof EngineState> = (
  setState: CustomSetState,
) => EngineState[K]

export const createEngineStore = () =>
  createStore<EngineState>()(
    subscribeWithSelector(
      devtools(
        immer((set) => ({
          isSketchModulesReady: false,
          sketches: {},
          nodes: {},
          nodeValues: {},
          sketchModules: {},
          addSketch: createAddSketch(set),
          setSketchModuleItem: createSetSketchModuleItem(set),
          updateNodeValue: createUpdateNodeValue(set),
          deleteSketch: createDeleteSketch(set),
          deleteSketchModule: createDeleteSketchModule(set),
        })),
      ),
    ),
  )

export type EngineStore = ReturnType<typeof createEngineStore>
