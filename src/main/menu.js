import { Menu, ipcMain } from 'electron'
import { mainWindow } from './mainWindow'

const onClick = (...args) => {
  mainWindow.webContents.send('app-menu-click', ...args)
}

const projectMenu = {
  label: 'Project',
  submenu: [
    {
      label: 'New',
      role: 'forcereload'
    },
    {
      label: 'Save',
      click: () => { onClick('project-save') },
      accelerator: 'CommandOrControl+S'
    },
    {
      label: 'Save As...',
      click: () => { onClick('project-save-as') },
      accelerator: 'CommandOrControl+Shift+S'
    },
    {
      label: 'Load',
      click: () => { onClick('project-load') }
    },
    {
      label: 'Settings',
      click: () => { onClick('project-settings') }
    }
  ]
}

const displayMenu = {
  label: 'Displays',
  submenu: []
}

const template = [
  {
    label: 'Hedron'
  },
  projectMenu,
  displayMenu,
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forcereload' },
      { role: 'toggledevtools' },
      { type: 'separator' },
      { role: 'resetzoom' },
      { role: 'zoomin' },
      { role: 'zoomout' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  }
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
