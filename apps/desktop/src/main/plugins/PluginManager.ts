import fs from 'fs'
import path from 'path'
import { BrowserWindow, dialog } from 'electron'
import type { BuildContext } from 'esbuild'
import { discoverPluginsInFolder, DiscoveredPlugin } from './discoverPlugins'
import { PluginFileServer } from './PluginFileServer'
import { readPluginSettings, writePluginSettings } from './pluginSettings'
import { BuildOutput, watchMainBuild, watchRendererBuild } from './buildPlugin'
import { MainPluginInstance } from './MainPluginInstance'
import { dependencyIds, resolveDependencies } from './resolveDependencies'
import { DependencyIssue, PluginEvents, PluginInfo, PluginsState } from '@shared/PluginEvents'
import { mainWindow } from '@main/mainWindow'

interface LoadedPlugin {
  plugin: DiscoveredPlugin
  rendererBuild?: BuildContext
  mainBuild?: BuildContext
  rendererUrl: string | null
  buildId: number
  rendererErrors: string[]
  mainErrors: string[]
  main: MainPluginInstance | null
}

/** Compares folders the way the file system does, so case and separators don't split one folder in two. */
const dirKey = (dir: string) => {
  const resolved = path.resolve(dir)
  return process.platform === 'win32' || process.platform === 'darwin'
    ? resolved.toLowerCase()
    : resolved
}

const entriesMatch = (a: DiscoveredPlugin, b: DiscoveredPlugin) =>
  dirKey(a.dir) === dirKey(b.dir) &&
  a.manifest.renderer === b.manifest.renderer &&
  a.manifest.main === b.manifest.main &&
  JSON.stringify(a.manifest.mainExternals) === JSON.stringify(b.manifest.mainExternals)

/** Finds, builds, watches and hosts runtime plugins, and tells the renderer what to load. */
export class PluginManager {
  private server = new PluginFileServer()
  private discovered: DiscoveredPlugin[] = []
  private dependencyIssues = new Map<DiscoveredPlugin, DependencyIssue[]>()
  private loaded = new Map<string, LoadedPlugin>()
  private projectPluginsDir: string | null = null
  // Refreshes run one at a time so overlapping requests can't double-load a plugin
  private queue: Promise<void> = Promise.resolve()

  private enqueue = (task: () => Promise<void>) => {
    const next = this.queue.then(task)
    this.queue = next.catch((error) => console.error('[HEDRON] Plugin task failed', error))
    return next
  }

  refresh = () => this.enqueue(this.doRefresh)

  private doRefresh = async () => {
    await this.server.start()
    const settings = readPluginSettings()

    // Project plugins come first, so a project's own copy of a plugin wins over the user's
    const found = [
      ...(this.projectPluginsDir ? discoverPluginsInFolder(this.projectPluginsDir, 'project') : []),
      ...settings.folders.flatMap((folder) => discoverPluginsInFolder(folder, 'user')),
    ]

    // One folder reached through both sources is one plugin, not a clash with itself
    const byDir = new Map<string, DiscoveredPlugin>()
    for (const plugin of found) {
      const existing = byDir.get(dirKey(plugin.dir))
      if (!existing) byDir.set(dirKey(plugin.dir), plugin)
      else if (!existing.sources.includes(plugin.sources[0]))
        existing.sources.push(plugin.sources[0])
    }
    const discovered = [...byDir.values()]

    const byId = new Map<string, DiscoveredPlugin>()
    for (const plugin of discovered) {
      const existing = byId.get(plugin.id)
      if (!existing) {
        byId.set(plugin.id, plugin)
      } else if (existing.sources.includes('project') && !plugin.sources.includes('project')) {
        plugin.overriddenBy = existing.dir
      } else {
        plugin.errors.push(`Another plugin already uses the id "${plugin.id}": ${existing.dir}`)
      }
    }
    this.discovered = discovered

    const { order, issues, loadable } = resolveDependencies(
      [...byId.values()],
      (id) => !settings.disabled.includes(id),
    )
    this.dependencyIssues = issues

    const shouldLoad = (plugin: DiscoveredPlugin | undefined): plugin is DiscoveredPlugin =>
      !!plugin && loadable.has(plugin.id)

    for (const [id, loaded] of [...this.loaded]) {
      const next = byId.get(id)
      if (!shouldLoad(next) || !entriesMatch(next, loaded.plugin)) await this.unload(id)
    }

    for (const plugin of order) {
      if (shouldLoad(plugin) && !this.loaded.has(plugin.id)) await this.load(plugin)
    }

    this.emitChanged()
  }

  private load = async (plugin: DiscoveredPlugin) => {
    const loaded: LoadedPlugin = {
      plugin,
      rendererUrl: null,
      buildId: 0,
      rendererErrors: [],
      mainErrors: [],
      main: null,
    }
    this.loaded.set(plugin.id, loaded)

    // Main activates first so the renderer half can talk to it as soon as it's created
    if (plugin.mainEntry) {
      try {
        loaded.mainBuild = await watchMainBuild(plugin, (output, isFirst) =>
          this.onMainBuild(loaded, output, isFirst),
        )
      } catch (error) {
        loaded.mainErrors = [String(error)]
      }
    }

    if (plugin.rendererEntry) {
      try {
        loaded.rendererBuild = await watchRendererBuild(
          plugin,
          `${this.server.baseUrl}/${plugin.id}`,
          (output, isFirst) => this.onRendererBuild(loaded, output, isFirst),
        )
      } catch (error) {
        loaded.rendererErrors = [String(error)]
      }
    }
  }

  private onRendererBuild = (loaded: LoadedPlugin, output: BuildOutput, isFirst: boolean) => {
    const { id } = loaded.plugin
    loaded.rendererErrors = output.errors

    // A failed rebuild keeps the last good build running and just reports the errors
    if (output.errors.length === 0 && output.files.has('index.js')) {
      this.server.setFiles(id, output.files)
      loaded.rendererUrl = `${this.server.baseUrl}/${id}/index.js`
      loaded.buildId++
    }

    if (!isFirst) this.emitChanged()
  }

  private onMainBuild = async (loaded: LoadedPlugin, output: BuildOutput, isFirst: boolean) => {
    loaded.mainErrors = output.errors
    const code = output.files.get('main.js')

    if (output.errors.length === 0 && code) {
      await loaded.main?.dispose()
      loaded.main = new MainPluginInstance(loaded.plugin)
      try {
        await loaded.main.activate(new TextDecoder().decode(code))
      } catch (error) {
        console.error(`[HEDRON] Plugin "${loaded.plugin.id}" main entry failed to activate`, error)
        loaded.mainErrors = [
          error instanceof Error ? (error.stack ?? error.message) : String(error),
        ]
        await loaded.main.dispose()
        loaded.main = null
      }
    }

    if (!isFirst) this.emitChanged()
  }

  private unload = async (id: string) => {
    const loaded = this.loaded.get(id)
    if (!loaded) return
    this.loaded.delete(id)

    await loaded.rendererBuild?.dispose()
    await loaded.mainBuild?.dispose()
    await loaded.main?.dispose()
    this.server.removeFiles(id)
  }

  getState = (): PluginsState => {
    const settings = readPluginSettings()
    const plugins = this.discovered.map((plugin): PluginInfo => {
      const loaded = this.loaded.get(plugin.id)
      const isThisCopy = !!loaded && dirKey(loaded.plugin.dir) === dirKey(plugin.dir)
      const dependencyIssues = this.dependencyIssues.get(plugin) ?? []
      return {
        id: plugin.id,
        name: plugin.name,
        version: plugin.version,
        description: plugin.description,
        dir: plugin.dir,
        sources: plugin.sources,
        overriddenBy: plugin.overriddenBy,
        enabled: !settings.disabled.includes(plugin.id),
        rendererUrl: isThisCopy ? loaded.rendererUrl : null,
        buildId: isThisCopy ? loaded.buildId : 0,
        hasMain: !!plugin.mainEntry,
        mainActive: isThisCopy && !!loaded.main,
        dependencies: dependencyIds(plugin),
        dependencyIssues,
        errors: [
          ...plugin.errors,
          ...dependencyIssues.filter((issue) => !issue.optional).map((issue) => issue.message),
          ...(isThisCopy ? [...loaded.mainErrors, ...loaded.rendererErrors] : []),
        ],
      }
    })
    return { plugins, folders: settings.folders }
  }

  /** Resolves once any pending refresh is done, so callers see settled state. */
  getSettledState = async () => {
    await this.queue
    return this.getState()
  }

  private emitChanged = () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send(PluginEvents.Changed, this.getState())
    }
  }

  addFolder = async (): Promise<{ error?: string }> => {
    const window = BrowserWindow.getFocusedWindow() ?? mainWindow
    const options: Electron.OpenDialogOptions = {
      title: 'Add plugin folder',
      properties: ['openDirectory'],
    }
    const result = window
      ? await dialog.showOpenDialog(window, options)
      : await dialog.showOpenDialog(options)
    if (result.canceled || result.filePaths.length === 0) return {}

    const folder = path.resolve(result.filePaths[0])
    if (discoverPluginsInFolder(folder, 'user').length === 0) {
      return { error: `No Hedron plugins found in ${folder}` }
    }

    const settings = readPluginSettings()
    if (!settings.folders.includes(folder)) {
      settings.folders.push(folder)
      writePluginSettings(settings)
    }
    await this.refresh()
    return {}
  }

  removeFolder = async (folder: string) => {
    const settings = readPluginSettings()
    settings.folders = settings.folders.filter((f) => f !== folder)
    writePluginSettings(settings)
    await this.refresh()
  }

  setEnabled = async (id: string, enabled: boolean) => {
    const settings = readPluginSettings()
    settings.disabled = settings.disabled.filter((d) => d !== id)
    if (!enabled) settings.disabled.push(id)
    writePluginSettings(settings)
    await this.refresh()
  }

  /** Fully tears a plugin down and loads it again, picking up manifest changes. */
  reload = async (id: string) => {
    await this.enqueue(async () => {
      await this.unload(id)
      await this.doRefresh()
    })
  }

  /**
   * Picks up the `plugins` folder beside a project's sketches folder. Opening someone else's
   * project must never run their code silently, so untrusted folders need the user's go-ahead.
   */
  setProject = async (sketchesDir: string | null) => {
    let pluginsDir = sketchesDir
      ? path.join(path.dirname(path.resolve(sketchesDir)), 'plugins')
      : null

    if (pluginsDir && fs.existsSync(pluginsDir)) {
      const found = discoverPluginsInFolder(pluginsDir, 'project')
      const settings = readPluginSettings()

      if (found.length > 0 && !settings.trustedProjectDirs.includes(pluginsDir)) {
        const options: Electron.MessageBoxOptions = {
          type: 'warning',
          title: 'Project plugins',
          message: 'This project includes plugins',
          detail:
            `${found.map((p) => `• ${p.name} (${p.id})`).join('\n')}\n\n` +
            `From: ${pluginsDir}\n\n` +
            'Plugins run code with full access to your computer. Only load them if you trust where this project came from.',
          buttons: ['Load plugins', "Don't load"],
          defaultId: 1,
          cancelId: 1,
        }
        const { response } = mainWindow
          ? await dialog.showMessageBox(mainWindow, options)
          : await dialog.showMessageBox(options)

        if (response === 0) {
          settings.trustedProjectDirs.push(pluginsDir)
          writePluginSettings(settings)
        } else {
          pluginsDir = null
        }
      }
    } else {
      pluginsDir = null
    }

    this.projectPluginsDir = pluginsDir
    await this.refresh()
    return this.getState()
  }

  shutdown = () =>
    this.enqueue(async () => {
      for (const id of [...this.loaded.keys()]) await this.unload(id)
      this.server.stop()
    })
}

export const pluginManager = new PluginManager()
