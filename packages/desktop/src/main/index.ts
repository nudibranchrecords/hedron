import path from 'path'
import fs, { mkdirSync, existsSync } from 'fs'
import { exec } from 'child_process'
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
import { FrameEvents, SaveFrameResponse } from '@shared/FrameEvents'
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

// Simple handler for saving frames as PNG files
ipcMain.handle(FrameEvents.SaveFrame, async (_, base64Data: string): Promise<SaveFrameResponse> => {
  try {
    // Save to user's documents folder
    const documentsPath = app.getPath('documents')
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `hedron-${timestamp}.png`
    const filePath = path.join(documentsPath, filename)
    // Write the file
    fs.writeFileSync(filePath, base64Data, 'base64')
    return { success: true, path: filePath }
  } catch (error) {
    console.error('Error saving frame:', error)
    return { success: false, error: String(error) }
  }
})

// Handler for saving a sequence of frames
ipcMain.handle(
  FrameEvents.SaveFrameSequence,
  async (_, base64Array: string[], name: string, video: boolean = false) => {
    try {
      const documentsPath = app.getPath('documents')
      const dirPath = path.join(documentsPath, name)
      if (!existsSync(dirPath)) {
        mkdirSync(dirPath)
      }
      for (let i = 0; i < base64Array.length; i++) {
        const filename = `${name}-${i}.png`
        const filePath = path.join(dirPath, filename)
        fs.writeFileSync(filePath, base64Array[i], 'base64')
      }

      let videoPath: string | undefined = undefined
      if (video) {
        // ffmpeg command to convert PNG sequence to mp4
        // -r 30: 30 fps, adjust as needed
        // -y: overwrite output file if exists
        // -framerate 30: input framerate
        // -i: input pattern
        // -pix_fmt yuv420p: for compatibility
        // -crf 18: high quality
        videoPath = path.join(dirPath, `${name}.mp4`)
        const ffmpegCmd = `ffmpeg -y -framerate 30 -i "${dirPath}/${name}-%d.png" -c:v libx264 -pix_fmt yuv420p -crf 18 "${videoPath}"`
        await new Promise<void>((resolve, reject) => {
          exec(ffmpegCmd, (error, stdout, stderr) => {
            if (error) {
              console.error('ffmpeg error:', error, stderr)
              reject(error)
            } else {
              resolve()
            }
          })
        })
      }

      return { success: true, path: dirPath, videoPath }
    } catch (error) {
      console.error('Error saving frame sequence:', error)
      return { success: false, error: String(error) }
    }
  },
)
