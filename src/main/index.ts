import { app, BrowserWindow, screen } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { updateDisplayMenu, updateMenu } from './menu'
import { createWindow } from './mainWindow'
import { handleSketchChanges } from './handleSketchChanges'

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

  // TODO: Clearly there is some event we can listen to to trigger this...
  setTimeout(() => {
    handleSketchChanges()
  }, 1000)

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
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

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
