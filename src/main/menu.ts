import { Display, Menu, ipcMain } from 'electron'

import { ScreenEvents } from '../shared/Events'
import { getMainWindow } from './mainWindow'

const onClick = (...args) => {
  mainWindow.webContents.send('app-menu-click', ...args)
}

const hedronMenu = {
  label: 'Hedron',
  submenu: [
    {
      label: 'About Hedron',
      click: () => {
        onClick('hedron-about')
      },
    },
  ],
}

const projectMenu = {
  label: 'Project',
  submenu: [
    {
      label: 'New',
      role: 'forcereload',
    },
    {
      label: 'Save',
      click: () => {
        onClick('project-save')
      },
      accelerator: 'CommandOrControl+S',
    },
    {
      label: 'Save As...',
      click: () => {
        onClick('project-save-as')
      },
      accelerator: 'CommandOrControl+Shift+S',
    },
    {
      label: 'Load',
      click: () => {
        onClick('project-load')
      },
    },
    {
      label: 'Settings',
      click: () => {
        onClick('project-settings')
      },
      accelerator: 'CommandOrControl+,',
    },
  ],
}

const displayMenu = {
  label: 'Send to display...',
  submenu: [],
}

const template = [
  hedronMenu,
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
      { role: 'togglefullscreen' },
    ],
  },
]

export const updateDisplayMenu = (displays: Display[]): void => {
  displayMenu.submenu = displays.map((display) => {
    const w = display.size.width
    const h = display.size.height

    return {
      label: `${display.label} (${w}x${h})`,
      click: () => {
        getMainWindow().webContents.send(ScreenEvents.SendOutput, display)
      },
    }
  })

  updateMenu()
}

ipcMain.on(ScreenEvents.UpdateDisplays, (e, displays) => {
  updateDisplayMenu(displays)
})

export const updateMenu = () => {
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}
