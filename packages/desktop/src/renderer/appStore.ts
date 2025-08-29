import { createAppStore, AppState } from '@hedron/app-store'
import { useStore } from 'zustand'

// Re-export types from @hedron/app-store for backward compatibility
export * from '@hedron/app-store'

// Create the app store instance
export const appStore = createAppStore()

// Create a useAppStore hook for this specific store instance
export const useAppStore = <T>(selector?: (state: AppState) => T) => {
  return useStore(appStore, selector!)
}
