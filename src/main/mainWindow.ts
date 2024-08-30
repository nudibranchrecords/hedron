import { BrowserWindow } from 'electron'
import icon from '../../resources/icon.png?asset'
import { is } from '@electron-toolkit/utils'
import { join } from 'path'

export let mainWindow: BrowserWindow | undefined

export const getMainWindow = (): BrowserWindow => {
  if (!mainWindow) throw new Error("Can't get main window")

  return mainWindow
}

export const sendToMainWindow = (event: string, data: string | string[]): void => {
  getMainWindow().webContents.send(event, data)
}

export const createWindow = (): void => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: !process.platform.startsWith('win'),
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
    },
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}
