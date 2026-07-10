import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electronApi: ElectronAPI
    api: unknown
  }
}
