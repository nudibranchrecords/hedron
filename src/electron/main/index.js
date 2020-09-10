import { app } from 'electron'
import { createMainWindow } from './mainWindow'
import { updateMenu } from './menu'
const isDevelopment = process.env.NODE_ENV !== 'production'

// The following is to allow electron dev tools to work on widnows with dark mode enabled
// Code from the bug report https://github.com/electron/electron/issues/19468#issuecomment-549593139
const electron = require('electron');
const path = require('path');
const fs = require('fs');
if (process.platform === 'win32') {
  const DevToolsExtensions = path.join(electron.app.getPath('userData'), 'DevTools Extensions')
  try {
    fs.unlinkSync(DevToolsExtensions)
  } catch (_) {
    // noop
  }
}
// End dark mode code

// Create main BrowserWindow when electron is ready
app.on('ready', () => {
  updateMenu()
  createMainWindow()
  if (isDevelopment) {
    const { default: installExtension, REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer')

    installExtension(REACT_DEVELOPER_TOOLS)
      // eslint-disable-next-line no-console
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.error('An error occurred: ', err))

    installExtension(REDUX_DEVTOOLS)
      // eslint-disable-next-line no-console
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.error('An error occurred: ', err))
  }
})
