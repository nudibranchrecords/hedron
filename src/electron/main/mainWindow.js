import { BrowserWindow, ipcMain, shell } from 'electron'
const argv = require('minimist')(process.argv)
const isDevelopment = process.env.NODE_ENV !== 'production'
const path = require('path')

// Global reference to mainWindow
// Necessary to prevent win from being garbage collected
export let mainWindow

export const createMainWindow = () => {
  // Construct new BrowserWindow

  const dimensions = isDevelopment
    ? {
      width: 1920,
      height: 1080,
    } // Smaller dimensions for prod for easier moving of window
    : {
      width: 800,
      height: 500,
    }

  mainWindow = new BrowserWindow({
    fullscreenable: true,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      nativeWindowOpen: true,
      webSecurity: false,
    },
    title: 'Hedron',
    // get Hedron icon to appear during dev (only works for win and linux)
    // for better icons, still need to build the app
    icon: isDevelopment && path.join(__dirname, '../../../build/icon.png'),
    ...dimensions,
  })

  mainWindow.webContents.on('new-window', (event, url, frameName, disposition, options, additionalFeatures) => {
    if (frameName === 'modal') {
      // open window as modal
      event.preventDefault()
      event.newGuest = new BrowserWindow(options)

      const outputSetBounds = (e, display) => {
        event.newGuest.setBounds(display.bounds)
      }

      ipcMain.on('reposition-output-window', outputSetBounds)

      event.newGuest.on('closed', () => {
        ipcMain.removeListener('reposition-output-window', outputSetBounds)
      })

      if (!isDevelopment) {
        setTimeout(() => {
          mainWindow.setFullScreen(true)
          event.newGuest.autoHideMenuBar = true
          event.newGuest.setMenuBarVisibility(false)
          event.newGuest.setFullScreen(true)
        }, 500)
      }
    }
  })

  ipcMain.on('open-dev-tools', () => {
    mainWindow.webContents.openDevTools()
  })

  // Set url for `win`
  // points to `webpack-dev-server` in development
  // points to `index.html` in production
  const url = isDevelopment
    ? `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`
    : `file://${__dirname}/index.html`

  if (isDevelopment) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.loadURL(url)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.on('hide', () => {
    mainWindow.webContents.send('window-hide')
  })

  mainWindow.on('show', () => {
    mainWindow.webContents.send('window-show')
  })

  // Open anchor tag links in new browser window
  mainWindow.webContents.on('will-navigate', (event, url) => {
    // Don't do anything if "localhost" as this is most likely
    // dev auto refresh rather than an anchor tag href
    if (url.includes('http://localhost:')) { return }

    event.preventDefault()
    shell.openExternal(url)
  })

  // setTimeout(() => {
  //   mainWindow.webContents.send('args', argv)
  // }, 2000)

  return mainWindow
}
