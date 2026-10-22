import fs from 'fs'
import path from 'path'
import { createRequire } from 'module'
import { ipcMain } from 'electron'
import * as sdk from '@hedron-gl/plugin-sdk'
import type {
  HedronMainPluginDefinition,
  MainDeactivate,
  PluginMainContext,
} from '@hedron-gl/plugin-sdk'
import { getPluginDataDir } from './pluginSettings'
import type { DiscoveredPlugin } from './discoverPlugins'
import { mainWindow } from '@main/mainWindow'
import { pluginChannel } from '@shared/PluginEvents'

type IpcListener = (event: Electron.IpcMainEvent, ...args: unknown[]) => void

/** One activation of a plugin's main entry; a rebuild disposes it and activates a fresh one. */
export class MainPluginInstance {
  private handlers: string[] = []
  private listeners: [string, IpcListener][] = []
  private deactivate: MainDeactivate | null = null

  constructor(private plugin: DiscoveredPlugin) {}

  /** Evaluates a CommonJS bundle as if it lived in the plugin folder, so its requires resolve from there. */
  private evaluate(code: string): HedronMainPluginDefinition {
    const { id, dir } = this.plugin
    const filename = path.join(dir, `.${id}.hedron-main.cjs`)
    const pluginRequire = createRequire(filename)
    const hostRequire = Object.assign(
      (specifier: string) =>
        specifier === '@hedron-gl/plugin-sdk' ? sdk : pluginRequire(specifier),
      { resolve: pluginRequire.resolve, cache: pluginRequire.cache },
    )

    const module = { exports: {} as Record<string, unknown> }
    const run = new Function(
      'exports',
      'require',
      'module',
      '__filename',
      '__dirname',
      `${code}\n//# sourceURL=hedron-plugin:///${id}/main.cjs`,
    )
    run(module.exports, hostRequire, module, filename, dir)

    const definition = (module.exports.default ?? module.exports) as HedronMainPluginDefinition
    if (typeof definition?.activate !== 'function') {
      throw new Error('Main entry must `export default defineMainPlugin({ activate })`')
    }
    return definition
  }

  private createContext(): PluginMainContext {
    const { id, dir } = this.plugin
    const dataDir = getPluginDataDir(id)
    fs.mkdirSync(dataDir, { recursive: true })

    return {
      id,
      dir,
      dataDir,
      handle: (channel, handler) => {
        const fullChannel = pluginChannel(id, channel)
        ipcMain.removeHandler(fullChannel)
        ipcMain.handle(fullChannel, (_, ...args) => handler(...args))
        this.handlers.push(fullChannel)
      },
      on: (channel, listener) => {
        const fullChannel = pluginChannel(id, channel)
        const wrapped: IpcListener = (_, ...args) => listener(...args)
        ipcMain.on(fullChannel, wrapped)
        this.listeners.push([fullChannel, wrapped])
      },
      send: (channel, ...args) => {
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send(pluginChannel(id, channel), ...args)
        }
      },
    }
  }

  activate = async (code: string) => {
    const definition = this.evaluate(code)
    const result = await definition.activate(this.createContext())
    if (typeof result === 'function') this.deactivate = result
  }

  dispose = async () => {
    for (const channel of this.handlers) ipcMain.removeHandler(channel)
    for (const [channel, listener] of this.listeners) ipcMain.removeListener(channel, listener)
    this.handlers = []
    this.listeners = []

    try {
      await this.deactivate?.()
    } catch (error) {
      console.error(
        `[HEDRON] Plugin "${this.plugin.id}" main entry threw while deactivating`,
        error,
      )
    }
    this.deactivate = null
  }
}
