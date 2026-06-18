import { createContext, useContext } from 'react'
import { useStore } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import { AppStore, AppState } from '@hedron-gl/app-store'
import { CustomSetState, EngineStore, EngineStateWithActions } from '@hedron-gl/engine'

export const AppStoreContext = createContext<AppStore | null>(null)

/** Reads the app store from context and throws when the provider is missing. */
export const useAppStoreWithContext = () => {
  const appStore = useContext(AppStoreContext)

  if (!appStore) {
    throw new Error('Missing AppStoreProvider')
  }

  return appStore
}

/** Selects a slice from the app store. */
export const useAppStore = <T>(selector: (state: AppState) => T) => {
  const appStore = useAppStoreWithContext()
  return useStore(appStore, selector)
}

export const AppStoreProvider = AppStoreContext.Provider

export const EngineStoreContext = createContext<EngineStore | null>(null)

type EngineStoreWithTypedSetState = Omit<EngineStore, 'setState'> & {
  setState: CustomSetState
}

/** Reads the engine store from context and throws when the provider is missing. */
export const useEngineStoreWithContext = () => {
  const engineStore = useContext(EngineStoreContext)

  if (!engineStore) {
    throw new Error('Missing EngineStoreProvider')
  }

  return engineStore as EngineStoreWithTypedSetState
}

/** Selects a slice from the engine store using default reference equality. */
export const useEngineStore = <T>(selector: (state: EngineStateWithActions) => T) => {
  const engineStore = useEngineStoreWithContext()

  return useStore(engineStore, selector)
}

/** Selects a slice from the engine store and applies shallow equality to reduce rerenders. */
export const useEngineStoreShallow = <T>(selector: (state: EngineStateWithActions) => T) => {
  const engineStore = useEngineStoreWithContext()

  return useStore(engineStore, useShallow(selector))
}

export const EngineStoreProvider = EngineStoreContext.Provider
