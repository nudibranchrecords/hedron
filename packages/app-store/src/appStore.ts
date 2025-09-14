import { createStore } from 'zustand/vanilla'
import { StoreApi } from 'zustand'
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type {} from '@redux-devtools/extension' // required for devtools typing
import { EngineData } from '@hedron/engine'

export type DialogId = 'sketchModules'

export interface SaveItem {
  title: string
  path: string
  date: number
  numScenes: number
  numSketches: number
}

export interface ProjectData {
  version: number
  engine: EngineData
  app: {
    sketchesDir: string
    // TODO: activeSketchId should be part of the save state
    // but causing errors when Hedron opens directly on a sketch
    // activeSketchId: string | null
    selectedNodes: { [sketchId: string]: string }
    selectedInputs: { [inputId: string]: string }
    openedParamGroups: { [sketchId: string]: Record<number, boolean> }
  }
}

export interface AppState {
  activeSketchId: string | null // TODO: should be part of ProjectData
  selectedNodes: ProjectData['app']['selectedNodes']
  selectedInputs: ProjectData['app']['selectedInputs']
  openedParamGroups: ProjectData['app']['openedParamGroups']
  sketchesDir: string | null
  globalDialogId: DialogId | null
  currentSavePath: string | null
  saveList: SaveItem[]
  setSelectedNode: (sketchID: string | null, nodeId: string) => void
  setSelectedInput: (nodeId: string, inputId: string) => void
  setOpenedParamGroup: (sketchId: string, groupIndex: number, isOpen: boolean) => void
  setActiveSketchId: (id: string) => void
  setSketchesDir: (dir: string) => void
  setGlobalDialogId: (id: DialogId | null) => void
  setCurrentSavePath: (path: string) => void
  addToSaveList: (path: SaveItem) => void
  removeFromSaveList: (path: string) => void
}

export type SetState = StoreApi<AppState>['setState']

// Matches immer middleware and devtools
export type CustomSetState = (
  cb: (draft: AppState) => void,
  replace?: boolean,
  name?: string,
) => void

export type SetterCreator<K extends keyof AppState> = (setState: CustomSetState) => AppState[K]

// Factory function to create the app store
export const createAppStore = () =>
  createStore<AppState>()(
    persist(
      subscribeWithSelector(
        devtools(
          immer((set) => ({
            activeSketchId: null,
            sketchesDir: null,
            globalDialogId: null,
            currentSavePath: null,
            selectedNodes: {},
            selectedInputs: {},
            openedParamGroups: {},
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
            removeFromSaveList: (path: string) => {
              set((state) => {
                return {
                  saveList: state.saveList.filter((item) => item.path !== path),
                }
              })
            },
            setSelectedNode: (sketchID, nodeId) => {
              set((state) => {
                let catId = sketchID
                if (!catId) {
                  // Some nodes wont have a relevant sketch ID, for now we store them under "aux"
                  catId = 'aux'
                }

                state.selectedNodes[catId] = nodeId
              })
            },
            setSelectedInput: (nodeId: string, inputId: string) => {
              set((state) => {
                state.selectedInputs[nodeId] = inputId
              })
            },
            setOpenedParamGroup: (sketchId: string, groupIndex: number, isOpen: boolean) => {
              set((state) => {
                if (!state.openedParamGroups[sketchId]) {
                  state.openedParamGroups[sketchId] = {}
                }
                state.openedParamGroups[sketchId][groupIndex] = isOpen
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

export type AppStore = ReturnType<typeof createAppStore>
