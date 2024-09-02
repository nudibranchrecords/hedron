import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type {} from '@redux-devtools/extension' // required for devtools typing
import { uid } from 'uid'

interface SketchState {
  id: string
  title: string
  moduleId: string
}

type Sketches = { [key: string]: SketchState }

interface SketchLibraryItem {
  moduleId: string
  title: string
  module: any
}

export type SketchLibrary = { [key: string]: SketchLibraryItem }

interface AppState {
  isSketchLibraryReady: boolean
  sketches: Sketches
  sketchLibrary: SketchLibrary
  activeSketchId: string | null
  setActiveSketchId: (id: string) => void
  setIsSketchLibraryReady: () => void
  addSketch: (moduleId: string) => void
  deleteSketch: (instanceId: string) => void
  setSketchLibrary: (newSketchLibrary: SketchLibrary) => void
  setSketchLibraryItem: (newItem: SketchLibraryItem) => void
}

export const useAppStore = create<AppState>()(
  devtools(
    // persist(
    (set) => ({
      isSketchLibraryReady: false,
      activeSketchId: 'id_a',
      sketches: {},
      sketchLibrary: {},
      setActiveSketchId: (id) => set(() => ({ activeSketchId: id })),
      setIsSketchLibraryReady: () => set(() => ({ isSketchLibraryReady: true })),
      addSketch: (moduleId) => {
        const newId = uid()
        set((state) => {
          const { title } = state.sketchLibrary[moduleId]
          return {
            sketches: {
              ...state.sketches,
              [newId]: {
                id: newId,
                moduleId: moduleId,
                title,
              },
            },
          }
        })
      },
      deleteSketch: (instanceId) => {
        set((state) => {
          delete state.sketches[instanceId]
          return {
            sketches: { ...state.sketches },
          }
        })
      },
      setSketchLibrary: (newSketchLibrary) =>
        set(() => ({
          sketchLibrary: newSketchLibrary,
        })),
      setSketchLibraryItem: (newItem: SketchLibraryItem) =>
        set((state) => ({
          sketchLibrary: {
            ...state.sketchLibrary,
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
