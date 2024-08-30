import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type {} from '@redux-devtools/extension' // required for devtools typing

interface SketchState {
  id: string
  sketchId: string
}

interface AppState {
  sketches: { [key: string]: SketchState }
}

const useAppStore = create<AppState>()(
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
      }),
      {
        name: 'bear-storage',
      },
    ),
  ),
)

export const getSketchesState = (): SketchState[] => {
  return Object.values(useAppStore.getState().sketches)
}
