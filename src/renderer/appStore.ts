import { create, StoreApi } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type {} from '@redux-devtools/extension' // required for devtools typing
import { DialogId } from 'src/engine/store/types'

export interface AppState {
  activeSketchId: string | null
  selectedNode: string | null
  sketchesDir: string | null
  globalDialogId: DialogId | null
  currentSavePath: string | null
  setSelectedNode: (nodeId: string) => void
  setActiveSketchId: (id: string) => void
  setSketchesDir: (dir: string) => void
  setGlobalDialogId: (id: DialogId | null) => void
  setCurrentSavePath: (path: string) => void
}

export type SetState = StoreApi<AppState>['setState']

// Matches immer middleware and devtools
export type CustomSetState = (
  cb: (draft: AppState) => void,
  replace?: boolean,
  name?: string,
) => void

export type SetterCreator<K extends keyof AppState> = (setState: CustomSetState) => AppState[K]

export const useAppStore = create<AppState>()(
  subscribeWithSelector(
    devtools(
      immer((set) => ({
        activeSketchId: null,
        selectedNode: null,
        sketchesDir: null,
        globalDialogId: null,
        currentSavePath: null,
        setSelectedNode: (nodeId: string) => {
          set((state) => {
            state.selectedNode = nodeId
          })
        },
        setActiveSketchId: (id: string) => {
          set((state) => {
            state.activeSketchId = id
          })
        },
        setSketchesDir: (dir: string) => {
          set((state) => {
            state.sketchesDir = dir
          })
        },
        setGlobalDialogId: (id: DialogId | null) => {
          set((state) => {
            state.globalDialogId = id
          })
        },
        setCurrentSavePath: (path: string) => {
          set((state) => {
            state.currentSavePath = path
          })
        },
      })),
    ),
  ),
)
