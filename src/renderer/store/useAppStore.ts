import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type {} from '@redux-devtools/extension' // required for devtools typing
import { uid } from 'uid'

interface SketchState {
  id: string
  title: string
  moduleId: string
  paramIds: string[]
}

type Sketches = { [key: string]: SketchState }

// TODO: How to type this??
export type SketchModule = any

interface NodeBase {
  id: string
  key: string
  title?: string
}

interface NodeParamNumber extends NodeBase {
  type: 'param'
  valueType: 'number'
  value: number
}

interface NodeParamBoolean extends NodeBase {
  type: 'param'
  valueType: 'boolean'
  value: boolean
}

export type Param = NodeParamBoolean | NodeParamNumber

type Node = Param

type Nodes = { [key: string]: Node }

interface SketchConfigParamBase {
  key: string
  title: string
}

interface SketchConfigParamNumber extends SketchConfigParamBase {
  valueType: undefined
  defaultValue: number
}

interface SketchConfigParamBoolean extends SketchConfigParamBase {
  valueType: 'boolean'
  defaultValue: boolean
}

type SketchConfigParam = SketchConfigParamNumber | SketchConfigParamBoolean

export interface SketchConfig {
  title: string
  params: SketchConfigParam[]
}
interface SketchModuleItem {
  moduleId: string
  title: string
  config: SketchConfig
  module: SketchModule
}

export type SketchModules = { [key: string]: SketchModuleItem }

interface AppState {
  // TODO: Maybe the modules should move to a separate store inside engine...
  sketchModules: SketchModules
  isSketchModulesReady: boolean
  sketches: Sketches
  nodes: Nodes
  activeSketchId: string | null
  setActiveSketchId: (id: string) => void
  setIsSketchModulesReady: () => void
  addSketch: (moduleId: string) => string
  deleteSketch: (instanceId: string) => void
  setSketchModules: (newSketchModules: SketchModules) => void
  setSketchModuleItem: (newItem: SketchModuleItem) => void
}

export const useAppStore = create<AppState>()(
  devtools(
    // persist(
    (set) => ({
      isSketchModulesReady: false,
      activeSketchId: 'id_a',
      sketches: {},
      nodes: {},
      sketchModules: {},
      setActiveSketchId: (id) => set(() => ({ activeSketchId: id })),
      setIsSketchModulesReady: () => set(() => ({ isSketchModulesReady: true })),
      addSketch: (moduleId) => {
        const newId = uid()
        set((state) => {
          const { title, config } = state.sketchModules[moduleId]
          const nodes: Nodes = {}
          const paramIds = []

          for (const paramConfig of config.params) {
            const valueType = paramConfig.valueType ?? 'number'
            const { key, title, defaultValue } = paramConfig
            const id = uid()

            paramIds.push(id)

            const base = {
              id,
              key,
              title,
              type: 'param' as const,
            }

            if (typeof defaultValue === 'number' && valueType === 'number') {
              nodes[id] = {
                ...base,
                valueType,
                value: defaultValue,
              }
            } else if (typeof defaultValue === 'boolean' && valueType === 'boolean') {
              nodes[id] = {
                ...base,
                valueType,
                value: defaultValue,
              }
            } else {
              throw new Error(
                `valueType of param ${paramConfig.key} does not match defaultValue for sketch ${moduleId}`,
              )
            }
          }

          return {
            sketches: {
              ...state.sketches,
              [newId]: {
                id: newId,
                moduleId,
                title,
                paramIds,
              },
            },
            nodes: {
              ...state.nodes,
              ...nodes,
            },
          }
        })

        return newId
      },
      deleteSketch: (instanceId) => {
        set((state) => {
          state.sketches[instanceId].paramIds.forEach((paramId) => {
            delete state.nodes[paramId]
          })

          delete state.sketches[instanceId]
          return {
            sketches: { ...state.sketches },
            nodes: { ...state.nodes },
          }
        })
      },
      setSketchModules: (newSketchModules) =>
        set(() => ({
          sketchModules: newSketchModules,
        })),
      setSketchModuleItem: (newItem: SketchModuleItem) =>
        set((state) => ({
          sketchModules: {
            ...state.sketchModules,
            [newItem.moduleId]: newItem,
          },
        })),
    }),
    //   {
    //     name: 'app-storage',
    //   },
    // ),
  ),
)

export const getSketchesState = (): SketchState[] => {
  return Object.values(useAppStore.getState().sketches)
}
