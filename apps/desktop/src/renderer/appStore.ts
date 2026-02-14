import { createAppStore, AppState } from '@hedron-gl/app-store'
import { useStore } from 'zustand'

export * from '@hedron-gl/app-store'

export const appStore = createAppStore()

export const useAppStore = <T>(selector?: (state: AppState) => T) => {
  return useStore(appStore, selector!)
}
