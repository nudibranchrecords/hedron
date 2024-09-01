import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type {} from '@redux-devtools/extension' // required for devtools typing
import { uid } from 'uid'

interface SketchState {
  id: string
  sketchId: string
}

type Sketches = { [key: string]: SketchState }

interface SketchLibraryItem {
  sketchId: string
  name: string
  module: { default: any }
}

export type SketchLibrary = { [key: string]: SketchLibraryItem }

interface AppState {
  isSketchLibraryReady: boolean
  sketches: Sketches
  sketchLibrary: SketchLibrary

  setIsSketchLibraryReady: () => void
  addSketch: (sketchId: string) => void
  deleteSketch: (instanceId: string) => void
  setSketchLibrary: (newSketchLibrary: SketchLibrary) => void
}

export const useAppStore = create<AppState>()(
  devtools(
    // persist(
    (set) => ({
      isSketchLibraryReady: false,
      sketches: {
        id_a: {
          id: 'id_a',
          sketchId: 'logo',
        },
        id_b: {
          id: 'id_b',
          sketchId: 'solid',
        },
        id_c: {
          id: 'id_c',
          sketchId: 'solid',
        },
      },
      sketchLibrary: {},
      setIsSketchLibraryReady: () => set(() => ({ isSketchLibraryReady: true })),
      addSketch: (sketchId) => {
        const newId = uid()
        set((state) => ({
          sketches: {
            ...state.sketches,
            [newId]: {
              id: newId,
              sketchId,
            },
          },
        }))
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
