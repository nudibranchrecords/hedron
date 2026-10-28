import { createStore, useStore } from 'zustand'
import type { IPlugin } from '@hedron-gl/engine'
import type { HedronPluginDefinition, PluginContext } from '@hedron-gl/plugin-sdk'
import { engine } from '@renderer/engine'
import { registerPluginViews, unregisterPluginViews } from '@renderer/plugins/pluginViews'
import { PluginEvents, PluginInfo, PluginsState, pluginChannel } from '@shared/PluginEvents'
import { sortByDependencies } from '@shared/pluginDependencies'

interface PluginHostState extends PluginsState {
  /** Errors thrown while importing or creating a plugin in the renderer, by plugin id. */
  loadErrors: Record<string, string>
}

export const pluginHostStore = createStore<PluginHostState>(() => ({
  plugins: [],
  folders: [],
  loadErrors: {},
}))

export const usePluginHost = <T>(selector: (state: PluginHostState) => T) =>
  useStore(pluginHostStore, selector)

interface LoadedRendererPlugin {
  buildId: number
  dependencies: string[]
  cleanups: (() => void)[]
}

const loaded = new Map<string, LoadedRendererPlugin>()

const ipc = () => window.electronApi.ipcRenderer

const setLoadError = (id: string, error: string | null) => {
  pluginHostStore.setState((state) => {
    const loadErrors = { ...state.loadErrors }
    if (error) loadErrors[id] = error
    else delete loadErrors[id]
    return { loadErrors }
  })
}

/** Importers hold a stable object per plugin, so swap its contents rather than the object. */
const setPluginApi = (pluginId: string, api: Record<string, unknown> | null) => {
  const apis = (window.__HEDRON.pluginApis ??= {})
  const target = (apis[pluginId] ??= {})
  for (const key of Object.keys(target)) delete target[key]
  if (api) Object.assign(target, api)
}

const createContext = (id: string, cleanups: (() => void)[]): PluginContext => ({
  id,
  engine,
  main: {
    invoke: <T>(channel: string, ...args: unknown[]) =>
      ipc().invoke(pluginChannel(id, channel), ...args) as Promise<T>,
    send: (channel, ...args) => ipc().send(pluginChannel(id, channel), ...args),
    on: (channel, listener) => {
      const remove = ipc().on(pluginChannel(id, channel), (_, ...args) => listener(...args))
      cleanups.push(remove)
      return remove
    },
  },
  storage: {
    read: (name) => ipc().invoke(PluginEvents.StorageRead, id, name) as Promise<string | null>,
    write: (name, data) => ipc().invoke(PluginEvents.StorageWrite, id, name, data) as Promise<void>,
  },
  getPlugin: <T extends IPlugin>(pluginId: string) => engine.getPlugin<T>(pluginId),
})

const unloadPlugin = (id: string) => {
  const plugin = loaded.get(id)
  if (!plugin) return
  loaded.delete(id)

  engine.unregisterPlugin(id)
  unregisterPluginViews(id)
  setPluginApi(id, null)
  for (const cleanup of plugin.cleanups) cleanup()
}

const loadPlugin = async (info: PluginInfo) => {
  unloadPlugin(info.id)
  const cleanups: (() => void)[] = []

  try {
    const module = await import(/* @vite-ignore */ `${info.rendererUrl}?build=${info.buildId}`)
    const definition = module.default as HedronPluginDefinition | undefined
    if (typeof definition?.create !== 'function') {
      throw new Error('Renderer entry must `export default definePlugin({ create })`')
    }

    const plugin = definition.create(createContext(info.id, cleanups))
    if (plugin.id !== info.id) {
      throw new Error(`Plugin created with id "${plugin.id}" but its manifest says "${info.id}"`)
    }

    engine.registerPlugin(plugin)
    registerPluginViews(info.id, definition.views)
    setPluginApi(info.id, definition.api?.(plugin) ?? null)

    loaded.set(info.id, { buildId: info.buildId, dependencies: info.dependencies, cleanups })
    setLoadError(info.id, null)
  } catch (error) {
    for (const cleanup of cleanups) cleanup()
    console.error(`[HEDRON] Plugin "${info.id}" failed to load`, error)
    setLoadError(info.id, error instanceof Error ? (error.stack ?? error.message) : String(error))
  }
}

// Reconciles one at a time, so a burst of change events can't load a plugin twice
let reconciling: Promise<void> = Promise.resolve()

const reconcile = (state: PluginsState) => {
  pluginHostStore.setState({ plugins: state.plugins, folders: state.folders })

  reconciling = reconciling.then(async () => {
    const wanted = new Map(
      state.plugins.filter((p) => p.enabled && p.rendererUrl).map((p) => [p.id, p] as const),
    )

    // Dependents unload before, and load after, the plugins they depend on
    const unwanted = sortByDependencies(
      [...loaded.keys()].filter((id) => !wanted.has(id)),
      (id) => id,
      (id) => loaded.get(id)?.dependencies ?? [],
    ).order
    for (const id of unwanted.reverse()) unloadPlugin(id)

    const { order } = sortByDependencies(
      [...wanted.values()],
      (info) => info.id,
      (info) => info.dependencies,
    )
    for (const info of order) {
      if (loaded.get(info.id)?.buildId !== info.buildId) await loadPlugin(info)
    }
  })
  return reconciling
}

/** Loads the user's plugins and keeps them in step with main (folder changes, toggles, rebuilds). */
let initialLoad: Promise<void> | null = null

export const initPluginHost = () => {
  ipc().on(PluginEvents.Changed, (_, state: PluginsState) => {
    reconcile(state)
  })
  initialLoad = ipc()
    .invoke(PluginEvents.List)
    .then(reconcile)
    .catch((error) => console.error('[HEDRON] Failed to load plugins', error))
  return initialLoad
}

/** Loads a project's own plugins (asking the user first if needed) before its data is applied. */
export const setPluginProject = async (sketchesDir: string | null) => {
  await initialLoad
  await reconcile(await ipc().invoke(PluginEvents.SetProject, sketchesDir))
}

export const pluginActions = {
  addFolder: () => ipc().invoke(PluginEvents.AddFolder) as Promise<{ error?: string }>,
  removeFolder: (folder: string) => ipc().invoke(PluginEvents.RemoveFolder, folder),
  setEnabled: (id: string, enabled: boolean) => ipc().invoke(PluginEvents.SetEnabled, id, enabled),
  reload: (id: string) => ipc().invoke(PluginEvents.Reload, id),
}
