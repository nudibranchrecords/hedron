import { app, BrowserWindow, dialog, ipcMain, screen, session } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { REDUX_DEVTOOLS, installExtension } from '@tomjs/electron-devtools-installer'
import { ProjectData } from '@shared/types'
import {
  DialogEvents,
  FileEvents,
  OpenProjectResponse,
  SaveProjectResponse,
  SketchEvents,
} from '@shared/Events'
import { updateDisplayMenu, updateMenu } from '@main/menu'
import { createWindow } from '@main/mainWindow'
import { startSketchesServer } from '@main/handleSketchFiles'
import { devSettings } from '@main/devSettings'
import { saveProjectFile } from '@main/handlers/saveProjectFile'
import { openProjectFile } from '@main/handlers/openProjectFile'

const isDevelopment = process.env.NODE_ENV !== 'production'

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  updateMenu()
  initiateScreens()

  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  if (isDevelopment) {
    let reduxDevtoolsInstaller: Promise<Electron.Extension>

    if (devSettings.reduxDevtoolsDir) {
      // Override automatic install
      // This is needed if there is some bug with the latest version
      // https://github.com/reduxjs/redux-devtools/issues/1730
      reduxDevtoolsInstaller = session.defaultSession.loadExtension(devSettings.reduxDevtoolsDir)
    } else {
      reduxDevtoolsInstaller = installExtension(REDUX_DEVTOOLS)
    }

    reduxDevtoolsInstaller
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.error('An error occurred: ', err))
  }
})

const updateDisplays = (): void => {
  const displays = screen.getAllDisplays()
  updateDisplayMenu(displays)
  // ipcMain.send(ScreenEvents.UpdateDisplays, displays)
  // store.dispatch(displaysListUpdate(displays))
}

export const initiateScreens = (): void => {
  updateDisplays()

  screen.on('display-added', updateDisplays)
  screen.on('display-removed', updateDisplays)
  screen.on('display-metrics-changed', updateDisplays)
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.handle(DialogEvents.OpenSketchesDirDialog, async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  })

  return result.filePaths[0]
})

ipcMain.handle(
  DialogEvents.OpenProjectFileDialog,
  async (_, projectPath?: string): Promise<OpenProjectResponse> => {
    return await openProjectFile(projectPath)
  },
)

ipcMain.handle(
  FileEvents.SaveProject,
  async (_, projectData: ProjectData, savePath: string | null): Promise<SaveProjectResponse> => {
    return await saveProjectFile(projectData, savePath)
  },
)

ipcMain.handle(SketchEvents.StartSketchesServer, async (_, sketchesDir: string) => {
  return await startSketchesServer(sketchesDir)
})
