import { createContext, useContext } from 'react'
import { useStore } from 'zustand'
import { AppStore, AppState } from '@hedron/app-store'
import { EngineStore, EngineStateWithActions } from '@hedron/engine'

export const AppStoreContext = createContext<AppStore | null>(null)

export const useAppStoreWithContext = () => {
  const appStore = useContext(AppStoreContext)

  if (!appStore) {
    throw new Error('Missing AppStoreProvider')
  }

  return appStore
}

export const useAppStore = <T>(selector?: (state: AppState) => T) => {
  const appStore = useAppStoreWithContext()
  return useStore(appStore, selector!)
}

export const AppStoreProvider = AppStoreContext.Provider

export const EngineStoreContext = createContext<EngineStore | null>(null)

export const useEngineStoreWithContext = () => {
  const engineStore = useContext(EngineStoreContext)

  if (!engineStore) {
    throw new Error('Missing EngineStoreProvider')
  }

  return engineStore
}

export const useEngineStore = <T>(selector?: (state: EngineStateWithActions) => T) => {
  const engineStore = useEngineStoreWithContext()

  return useStore(engineStore, selector!)
}

export const EngineStoreProvider = EngineStoreContext.Provider
