import { Display, Menu, ipcMain } from 'electron'

import { AppMenuEvents, AppMenuEventsItem, ScreenEvents } from '../shared/Events'
import { sendToMainWindow } from './mainWindow'

const onClick = (menuItemClick: AppMenuEventsItem) => {
  sendToMainWindow(AppMenuEvents.AppMenuClick, menuItemClick)
}

const hedronMenu = {
  label: 'Hedron',
  submenu: [
    {
      label: 'About Hedron',
      click: () => {
        // onClick('hedron-about')
      },
    },
  ],
}

const projectMenu = {
  label: 'Project',
  submenu: [
    //   {
    //     label: 'New',
    //     role: 'forcereload',
    //   },
    {
      label: 'Save',
      click: () => {
        onClick(AppMenuEventsItem.Save)
      },
      accelerator: 'CommandOrControl+S',
    },
    {
      label: 'Save As...',
      click: () => {
        onClick(AppMenuEventsItem.SaveAs)
      },
      accelerator: 'CommandOrControl+Shift+S',
    },
    {
      label: 'Load...',
      click: () => {
        onClick(AppMenuEventsItem.Load)
      },
    },
    //   {
    //     label: 'Settings',
    //     click: () => {
    //       onClick('project-settings')
    //     },
    //     accelerator: 'CommandOrControl+,',
    //   },
  ],
}

const displayMenu: Electron.MenuItemConstructorOptions = {
  label: 'Send to display...',
  submenu: [],
}

const template: Electron.MenuItemConstructorOptions[] = [
  hedronMenu,
  projectMenu,
  displayMenu,
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
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

ipcMain.on(ScreenEvents.UpdateDisplays, (_, displays) => {
  updateDisplayMenu(displays)
})

export const updateMenu = () => {
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}
