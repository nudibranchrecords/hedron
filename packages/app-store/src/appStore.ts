import { createStore } from 'zustand/vanilla'
import { StoreApi } from 'zustand'
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type {} from '@redux-devtools/extension' // required for devtools typing
import { EngineData } from '@hedron-gl/engine'

export type DialogId = 'sketchModules' | 'sketchesServerBuildResult'

export interface BuildMessage {
  text: string
  location?: {
    file: string
    line: number
    column: number
    lineText: string
  } | null
}

export interface BuildResult {
  errors: BuildMessage[]
  warnings: BuildMessage[]
}

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
    activeSketchId: string | null
    selectedNodes: { [sketchId: string]: string | null }
    selectedInputs: { [inputId: string]: string | null }
    openedControlGroups: { [sketchId: string]: Record<number, boolean> }
  }
}

export interface AppState {
  activeSketchId: string | null // TODO: should be part of ProjectData
  selectedNodes: ProjectData['app']['selectedNodes']
  selectedInputs: ProjectData['app']['selectedInputs']
  openedControlGroups: ProjectData['app']['openedControlGroups']
  sketchesDir: string | null
  globalDialogId: DialogId | null
  currentSavePath: string | null
  saveList: SaveItem[]
  sketchesServerBuildResult: BuildResult | null
  resourcesUrl: string | null
  resourcesFiles: string[]
  setSelectedNode: (sketchID: string, nodeId: string | null) => void
  setSelectedInput: (nodeId: string, inputId: string | null) => void
  setOpenedControlGroup: (sketchId: string, groupIndex: number, isOpen: boolean) => void
  setActiveSketchId: (id: string) => void
  setSketchesDir: (dir: string) => void
  setGlobalDialogId: (id: DialogId | null) => void
  setCurrentSavePath: (path: string) => void
  addToSaveList: (path: SaveItem) => void
  removeFromSaveList: (path: string) => void
  setSketchesServerBuildResult: (result: BuildResult | null) => void
  addResourceFile: (fileName: string) => void
  removeResourceFile: (fileName: string) => void
  cleanupStaleReferences: (engineData: EngineData) => void
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
            openedControlGroups: {},
            saveList: [],
            sketchesServerBuildResult: null,
            resourcesUrl: null,
            resourcesFiles: [],
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
            setSketchesServerBuildResult: (result: BuildResult | null) => {
              set((state) => {
                state.sketchesServerBuildResult = result
              })
            },
            addResourceFile: (fileName: string) => {
              set((state) => {
                if (!state.resourcesFiles.includes(fileName)) {
                  state.resourcesFiles.push(fileName)
                }
              })
            },
            removeResourceFile: (fileName: string) => {
              set((state) => {
                state.resourcesFiles = state.resourcesFiles.filter((f) => f !== fileName)
              })
            },
            setSelectedNode: (sketchID, nodeId) => {
              set((state) => {
                state.selectedNodes[sketchID] = nodeId
              })
            },
            setSelectedInput: (nodeId, inputId) => {
              set((state) => {
                state.selectedInputs[nodeId] = inputId
              })
            },
            setOpenedControlGroup: (sketchId: string, groupIndex: number, isOpen: boolean) => {
              set((state) => {
                if (!state.openedControlGroups[sketchId]) {
                  state.openedControlGroups[sketchId] = {}
                }
                state.openedControlGroups[sketchId][groupIndex] = isOpen
              })
            },
            cleanupStaleReferences: (engineData: EngineData) => {
              set((state) => {
                const validNodeIds = new Set(Object.keys(engineData.nodes))
                const validSketchIds = new Set(Object.keys(engineData.sketches))

                for (const sketchId of Object.keys(state.selectedNodes)) {
                  if (!validSketchIds.has(sketchId)) {
                    delete state.selectedNodes[sketchId]
                    continue
                  }

                  const selectedNodeId = state.selectedNodes[sketchId]
                  if (selectedNodeId && !validNodeIds.has(selectedNodeId)) {
                    delete state.selectedNodes[sketchId]
                  }
                }

                for (const selectedNodeId of Object.keys(state.selectedInputs)) {
                  const selectedInputId = state.selectedInputs[selectedNodeId]
                  if (
                    !validNodeIds.has(selectedNodeId) ||
                    !selectedInputId ||
                    !validNodeIds.has(selectedInputId)
                  ) {
                    delete state.selectedInputs[selectedNodeId]
                  }
                }

                for (const sketchId of Object.keys(state.openedControlGroups)) {
                  if (!validSketchIds.has(sketchId)) {
                    delete state.openedControlGroups[sketchId]
                  }
                }
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
