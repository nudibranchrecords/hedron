import { create, StoreApi } from 'zustand'
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type {} from '@redux-devtools/extension' // required for devtools typing
import { DialogId } from 'src/engine/store/types'

export interface SaveItem {
  title: string
  path: string
  date: number
  numScenes: number
  numSketches: number
}

export interface AppState {
  projectTitle: string
  activeSketchId: string | null
  sketchesDir: string | null
  globalDialogId: DialogId | null
  currentSavePath: string | null
  saveList: SaveItem[]
  setActiveSketchId: (id: string) => void
  setSketchesDir: (dir: string) => void
  setGlobalDialogId: (id: DialogId | null) => void
  setCurrentSavePath: (path: string) => void
  addToSaveList: (path: SaveItem) => void
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
  persist(
    subscribeWithSelector(
      devtools(
        immer((set) => ({
          projectTitle: 'Cool Project',
          activeSketchId: null,
          sketchesDir: null,
          globalDialogId: null,
          currentSavePath: null,
          saveList: [],
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
          addToSaveList: (newItem: SaveItem) => {
            set((state) => {
              const arr = state.saveList.filter((item) => item.path !== newItem.path)
              arr.unshift(newItem)
              state.saveList = arr
            })
          },
        })),
      ),
    ),
    {
      name: 'app-storage',
      partialize: (state) => ({ saveList: state.saveList }),
    },
  ),
)
