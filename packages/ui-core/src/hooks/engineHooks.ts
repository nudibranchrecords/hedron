import { createContext, useContext } from 'react'
import { useStore } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import { AppStore, AppState } from '@hedron-gl/app-store'
import { EngineStateWithActions, HedronEngine } from '@hedron-gl/engine'

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

/** Selects a slice from the app store and applies shallow equality to reduce rerenders. */
export const useAppStoreShallow = <T>(selector: (state: AppState) => T) => {
  const appStore = useAppStoreWithContext()
  return useStore(appStore, useShallow(selector))
}

export const AppStoreProvider = AppStoreContext.Provider

export const EngineContext = createContext<HedronEngine | null>(null)

/** Reads the engine store from context and throws when the provider is missing. */
export const useEngine = () => {
  const engine = useContext(EngineContext)

  if (!engine) {
    throw new Error('Missing EngineProvider')
  }

  return engine
}

/** Selects a slice from the engine store using default reference equality. */
export const useEngineStore = <T>(selector: (state: EngineStateWithActions) => T) => {
  const engineStore = useEngine().getStore()

  return useStore(engineStore, selector)
}

/** Selects a slice from the engine store and applies shallow equality to reduce rerenders. */
export const useEngineStoreShallow = <T>(selector: (state: EngineStateWithActions) => T) => {
  const engineStore = useEngine().getStore()

  return useStore(engineStore, useShallow(selector))
}

export const EngineProvider = EngineContext.Provider

export const useResourcePath = (filename: string | null) => {
  const resourcesUrl = useAppStore((state) => state.resourcesUrl)
  const file = useEngineStore((state) => (filename ? state.resources[filename] : null))
  return file?.fileName ? `${resourcesUrl}/${file.fileName}` : null
}
