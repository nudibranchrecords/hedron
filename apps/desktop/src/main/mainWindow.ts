import { join } from 'path'
import { BrowserWindow, powerSaveBlocker } from 'electron'
import { is } from '@electron-toolkit/utils'
import icon from '@resources/icon.png?asset'
import { OUTPUT_WINDOW_NAME } from '@shared/constants'

export let mainWindow: BrowserWindow | undefined

let powerSaveBlockID: number

export const getMainWindow = (): BrowserWindow => {
  if (!mainWindow) throw new Error("Can't get main window")

  return mainWindow
}

export const sendToMainWindow = (event: string, data?: unknown): void => {
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
    title: 'Hedron',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      // * backgroundThrottling:false important for Hedron! *
      // When `true`, the frame loop can pause if the main window is hidden
      // which is catastrophic for live shows when sending to an external display
      backgroundThrottling: false,
    },
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.webContents.on('did-create-window', (window, { frameName }) => {
    if (frameName === OUTPUT_WINDOW_NAME) {
      // Wait until window has been moved before setting full screen
      setTimeout(() => {
        window.autoHideMenuBar = true
        window.setMenuBarVisibility(false)
        window.setFullScreen(true)
        powerSaveBlockID = powerSaveBlocker.start('prevent-display-sleep')
      }, 500)
    }

    window.on('close', () => {
      if (frameName === OUTPUT_WINDOW_NAME) {
        powerSaveBlocker.stop(powerSaveBlockID)
      }
    })
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}
