import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type {} from '@redux-devtools/extension' // required for devtools typing

interface SketchState {
  id: string
  sketchId: string
}

type Sketches = { [key: string]: SketchState }

interface SketchLibraryItem {
  sketchId: string
  name: string
}

export type SketchLibrary = { [key: string]: SketchLibraryItem }

interface AppState {
  sketches: Sketches
  sketchLibrary: SketchLibrary

  setSketchLibrary: (newSketchLibrary: SketchLibrary) => void
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
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
        setSketchLibrary: (newSketchLibrary) =>
          set(() => ({
            sketchLibrary: newSketchLibrary,
          })),
      }),
      {
        name: 'app-storage',
      },
    ),
  ),
)

export const getSketchesState = (): SketchState[] => {
  return Object.values(useAppStore.getState().sketches)
}
