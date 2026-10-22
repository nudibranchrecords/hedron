export enum PluginEvents {
  List = 'plugins:list',
  AddFolder = 'plugins:add-folder',
  RemoveFolder = 'plugins:remove-folder',
  SetEnabled = 'plugins:set-enabled',
  Reload = 'plugins:reload',
  SetProject = 'plugins:set-project',
  StorageRead = 'plugins:storage-read',
  StorageWrite = 'plugins:storage-write',
  // Main → renderer, carries a PluginsState whenever plugins are added, removed or rebuilt
  Changed = 'plugins:changed',
}

export type PluginSource = 'user' | 'project'

export interface PluginInfo {
  id: string
  name: string
  version: string
  description: string
  dir: string
  source: PluginSource
  enabled: boolean
  /** Null when there's no renderer entry, the plugin is disabled, or the build failed. */
  rendererUrl: string | null
  /** Increments on every successful renderer build, so the renderer knows to reload. */
  buildId: number
  hasMain: boolean
  mainActive: boolean
  errors: string[]
}

export interface PluginsState {
  plugins: PluginInfo[]
  folders: string[]
}

/** IPC channel for a plugin's own messages between its renderer and main entries. */
export const pluginChannel = (pluginId: string, channel: string) => `plugin:${pluginId}:${channel}`

/** Plugin ids double as folder names and channel prefixes, so keep them simple. */
export const isValidPluginId = (id: unknown): id is string =>
  typeof id === 'string' && /^[a-z0-9][a-z0-9._-]*$/i.test(id)
