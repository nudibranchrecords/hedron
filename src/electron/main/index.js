import { app } from 'electron'
import { createMainWindow } from './mainWindow'
import { updateMenu } from './menu'
const isDevelopment = process.env.NODE_ENV !== 'production'


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
