import fs from 'fs'
import path from 'path'
import { app, ipcMain } from 'electron'
import { pluginManager } from './PluginManager'
import { getPluginDataDir } from './pluginSettings'
import { isValidPluginId, PluginEvents } from '@shared/PluginEvents'

// Storage names are plain file names inside the plugin's own data folder
const storagePath = (pluginId: unknown, name: unknown) => {
  if (!isValidPluginId(pluginId)) throw new Error(`Invalid plugin id: ${pluginId}`)
  const fileName = typeof name === 'string' ? path.basename(name) : ''
  if (!fileName || fileName === '.' || fileName === '..') {
    throw new Error(`Invalid storage name: ${name}`)
  }
  return path.join(getPluginDataDir(pluginId), fileName)
}

export const initPlugins = () => {
  ipcMain.handle(PluginEvents.List, () => pluginManager.getSettledState())
  ipcMain.handle(PluginEvents.AddFolder, () => pluginManager.addFolder())
  ipcMain.handle(PluginEvents.RemoveFolder, (_, folder: string) =>
    pluginManager.removeFolder(folder),
  )
  ipcMain.handle(PluginEvents.SetEnabled, (_, id: string, enabled: boolean) =>
    pluginManager.setEnabled(id, enabled),
  )
  ipcMain.handle(PluginEvents.Reload, (_, id: string) => pluginManager.reload(id))
  ipcMain.handle(PluginEvents.SetProject, (_, sketchesDir: string | null) =>
    pluginManager.setProject(sketchesDir),
  )

  ipcMain.handle(PluginEvents.StorageRead, async (_, pluginId: unknown, name: unknown) => {
    try {
      return await fs.promises.readFile(storagePath(pluginId, name), 'utf8')
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null
      throw error
    }
  })

  ipcMain.handle(
    PluginEvents.StorageWrite,
    async (_, pluginId: unknown, name: unknown, data: unknown) => {
      const filePath = storagePath(pluginId, name)
      await fs.promises.mkdir(path.dirname(filePath), { recursive: true })
      await fs.promises.writeFile(filePath, String(data), 'utf8')
    },
  )

  // Main entries may hold devices open, so give them a chance to release before exit
  let isShutDown = false
  app.on('before-quit', (event) => {
    if (isShutDown) return
    event.preventDefault()
    const timeout = new Promise((resolve) => setTimeout(resolve, 3000))
    Promise.race([pluginManager.shutdown(), timeout]).finally(() => {
      isShutDown = true
      app.quit()
    })
  })

  pluginManager.refresh()
}
