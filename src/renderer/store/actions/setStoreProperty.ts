import { AppState, useAppStore } from '../useAppStore'

export const setStoreProperty = <K extends keyof AppState>(property: K, value: AppState[K]) => {
  useAppStore.setState(() => {
    return {
      [property]: value,
    }
  })
}
