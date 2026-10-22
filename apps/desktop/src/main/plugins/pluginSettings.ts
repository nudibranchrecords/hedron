import fs from 'fs'
import path from 'path'
import { app } from 'electron'

export interface PluginSettings {
  /** Folders that are a plugin, or contain plugin folders. */
  folders: string[]
  /** Ids the user switched off; everything else found is enabled. */
  disabled: string[]
  /** Project plugin folders the user agreed to run code from. */
  trustedProjectDirs: string[]
}

const DEFAULT_SETTINGS: PluginSettings = { folders: [], disabled: [], trustedProjectDirs: [] }

const settingsPath = () => path.join(app.getPath('userData'), 'plugins.json')

const stringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : []

export const readPluginSettings = (): PluginSettings => {
  try {
    const raw = JSON.parse(fs.readFileSync(settingsPath(), 'utf8'))
    return {
      folders: stringArray(raw.folders),
      disabled: stringArray(raw.disabled),
      trustedProjectDirs: stringArray(raw.trustedProjectDirs),
    }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

export const writePluginSettings = (settings: PluginSettings) => {
  fs.writeFileSync(settingsPath(), JSON.stringify(settings, null, 2), 'utf8')
}

/** Per-plugin folder for machine-scoped data, outside any project. */
export const getPluginDataDir = (pluginId: string) =>
  path.join(app.getPath('userData'), 'plugin-data', pluginId)
