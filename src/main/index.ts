import { app, BrowserWindow, dialog, ipcMain, screen, session } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { updateDisplayMenu, updateMenu } from './menu'
import { createWindow } from './mainWindow'
import { startSketchesServer } from './handleSketchFiles'
import { devSettings } from './devSettings'
import { REDUX_DEVTOOLS, installExtension } from '@tomjs/electron-devtools-installer'
import { FileEvents, ProjectFileDialogResponse, SketchEvents } from '../shared/Events'
import path from 'path'
import fs from 'fs'

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

ipcMain.handle(FileEvents.OpenSketchesDirDialog, async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  })

  return result.filePaths[0]
})

ipcMain.handle(FileEvents.OpenProjectFileDialog, async (): Promise<ProjectFileDialogResponse> => {
  const result = await dialog.showOpenDialog({
    filters: [{ name: 'Poject', extensions: ['json'] }],
  })

  if (!result.canceled && result.filePaths.length > 0) {
    const projectFile = result.filePaths[0]

    try {
      // Read and parse the JSON from the project file
      const fileContent = fs.readFileSync(projectFile, { encoding: 'utf8' })
      const projectData = JSON.parse(fileContent)

      // Get the directory of the project file
      const projectDir = path.dirname(projectFile)

      // Path to the neighboring 'sketches' directory
      const sketchesDir = path.join(projectDir, 'sketches')

      // TODO: allow users to select sketches folder if not found
      try {
        const stats = fs.statSync(sketchesDir)
        if (!stats.isDirectory()) {
          return { result: 'error', error: 'Could not find associated sketches folder for project' }
        }
      } catch (err) {
        console.error(err)
        return { result: 'error', error: 'Could not find associated sketches folder for project' }
      }

      // Return both the JSON data and the sketches directory path (if it exists)
      return {
        result: 'success',
        projectData,
        sketchesDirPath: sketchesDir,
      }
    } catch (err) {
      console.error('Error reading or parsing the project file:', err)
      return { result: 'error', error: 'Failed to read or parse the project file' }
    }
  }

  return { result: 'cancelled' }
})

ipcMain.handle(SketchEvents.StartSketchesServer, async (_, sketchesDir: string) => {
  return await startSketchesServer(sketchesDir)
})
