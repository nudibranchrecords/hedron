import { ParamValue } from '@hedron-gl/engine'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export interface ParamPresetStoreItem {
  title: string
  paramValuesByKey: Record<string, ParamValue>
}

interface ParamPresetsStoreState {
  byModuleId: Record<string, Record<string, ParamPresetStoreItem>>
  addPreset: (moduleId: string, presetTitle: string, params: Record<string, ParamValue>) => void
  deletePreset: (moduleId: string, presetId: string) => void
  overwritePreset: (moduleId: string, presetId: string, params: Record<string, ParamValue>) => void
  editPresetTitle: (moduleId: string, presetId: string, newTitle: string) => void
}

export const useParamPresetsStore = create<ParamPresetsStoreState>()(
  persist(
    immer((set) => ({
      byModuleId: {},
      addPreset: (moduleId, presetTitle, params) => {
        const presetId = crypto.randomUUID()

        set((state) => {
          state.byModuleId[moduleId] ??= {}
          state.byModuleId[moduleId][presetId] = {
            title: presetTitle,
            paramValuesByKey: params,
          }
        })
      },
      deletePreset: (moduleId, presetId) => {
        set((state) => {
          const modulePresets = state.byModuleId[moduleId]
          if (!modulePresets) return

          delete modulePresets[presetId]
        })
      },
      overwritePreset: (moduleId, presetId, params) => {
        set((state) => {
          const modulePresets = state.byModuleId[moduleId]
          if (!modulePresets) return

          const targetPreset = modulePresets[presetId]
          if (!targetPreset) return

          targetPreset.paramValuesByKey = params
        })
      },
      editPresetTitle: (moduleId, presetId, newTitle) => {
        set((state) => {
          const modulePresets = state.byModuleId[moduleId]
          if (!modulePresets) return

          const targetPreset = modulePresets[presetId]
          if (!targetPreset) return

          targetPreset.title = newTitle
        })
      },
    })),
    {
      name: 'hedron-param-presets',
    },
  ),
)
