import { Menu, ipcMain } from 'electron'
import { mainWindow } from './mainWindow'

const displayMenu = {
  label: 'Displays',
  submenu: []
}

const template = [
  {
    label: 'Hedron'
  },
  displayMenu
]

ipcMain.on('update-displays', (e, displays) => {
  displayMenu.submenu = displays.map((display, index) => {
    const w = display.size.width
    const h = display.size.height

    return {
      label: `Send to ${w}x${h}`,
      click: () => {
        mainWindow.webContents.send('send-output', index)
      }
    }
  })

  updateMenu()
})

export const updateMenu = () => {
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}
