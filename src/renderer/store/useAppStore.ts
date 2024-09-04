import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type {} from '@redux-devtools/extension' // required for devtools typing
import { Nodes, Sketches, SketchModules } from './types'

export interface AppState {
  sketchModules: SketchModules
  isSketchModulesReady: boolean
  sketches: Sketches
  nodes: Nodes
  activeSketchId: string | null
}

export const useAppStore = create<AppState>()(
  devtools<AppState>(
    // persist(
    () => ({
      isSketchModulesReady: false,
      activeSketchId: 'id_a',
      sketches: {},
      nodes: {},
      sketchModules: {},
    }),
    //   {
    //     name: 'app-storage',
    //   },
    // ),
  ),
)
