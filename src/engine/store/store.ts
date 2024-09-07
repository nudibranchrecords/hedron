import { createStore, StoreApi } from 'zustand/vanilla'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import type {} from '@redux-devtools/extension' // required for devtools typing
import { Nodes, NodeValues, Sketches, SketchModuleItem, SketchModules } from './types'
import { createAddSketch } from './actionCreators/addSketch'
import { createSetSketchModuleItem } from './actionCreators/setSketchModuleItem'
import { createUpdateNodeValue } from './actionCreators/updateNodeValue'
import { createDeleteSketch } from './actionCreators/deleteSketch'

export interface HedronState {
  sketchModules: SketchModules
  isSketchModulesReady: boolean
  sketches: Sketches
  nodes: Nodes
  nodeValues: NodeValues
  activeSketchId: string | null
  addSketch: (moduleId: string) => string
  deleteSketch: (instanceId: string) => void
  setSketchModuleItem: (newItem: SketchModuleItem) => void
  updateNodeValue: (nodeId: string, value: number) => void
}

// export type HedronStore = StoreApi<HedronState>

export type SetState = StoreApi<HedronState>['setState']

export type SetterCreator<K extends keyof HedronState> = (setState: SetState) => HedronState[K]

export const createHedronStore = () =>
  createStore<HedronState>()(
    subscribeWithSelector(
      devtools((set) => ({
        isSketchModulesReady: false,
        activeSketchId: 'id_a',
        sketches: {},
        nodes: {},
        nodeValues: {},
        sketchModules: {},
        addSketch: createAddSketch(set),
        setSketchModuleItem: createSetSketchModuleItem(set),
        updateNodeValue: createUpdateNodeValue(set),
        deleteSketch: createDeleteSketch(set),
      })),
    ),
  )

export type HedronStore = ReturnType<typeof createHedronStore>
