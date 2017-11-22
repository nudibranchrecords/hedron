'use strict'
import installExtension, { REDUX_DEVTOOLS } from 'electron-devtools-installer'

import { app, BrowserWindow } from 'electron'

const isDevelopment = process.env.NODE_ENV !== 'production'

// Global reference to mainWindow
// Necessary to prevent win from being garbage collected
let mainWindow

function createMainWindow () {
  // Construct new BrowserWindow
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      nativeWindowOpen: true,
      webSecurity: false
    }
  })

  mainWindow.webContents.on('new-window', (event, url, frameName, disposition, options, additionalFeatures) => {
    if (frameName === 'modal') {
    // open window as modal
      event.preventDefault()
      event.newGuest = new BrowserWindow(options)

      if (!isDevelopment) {
        setTimeout(() => {
          event.newGuest.setFullScreen(true)
        }, 500)
      }
    }
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

  mainWindow.webContents.send('devtools-opened', () => {
    mainWindow.focus()
    setImmediate(() => {
      mainWindow.focus()
    })
  })

  return mainWindow
}

// Quit application when all windows are closed
app.on('window-all-closed', () => {
  // On macOS it is common for applications to stay open
  // until the user explicitly quits
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  // On macOS it is common to re-create a window
  // even after all windows have been closed
  if (mainWindow === null) mainWindow = createMainWindow()
})

// Create main BrowserWindow when electron is ready
app.on('ready', () => {
  mainWindow = createMainWindow()
  if (isDevelopment) {
    installExtension(REDUX_DEVTOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err))
  }
})
