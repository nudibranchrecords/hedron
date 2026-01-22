import { createAppStore, AppState } from '@hedron/app-store'
import { useStore } from 'zustand'

export * from '@hedron/app-store'

export const appStore = createAppStore()

export const useAppStore = <T>(selector?: (state: AppState) => T) => {
  return useStore(appStore, selector!)
}
