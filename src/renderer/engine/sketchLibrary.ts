import { uid } from 'uid'
import { getSketchesServerUrl } from './globals'
import { SketchLibrary, useAppStore } from './sketchesState'

export const initiateSketchLibrary = (sketchLibraryIds: string[]): void => {
  const base = getSketchesServerUrl()
  const cacheBust = uid()

  const getSketchInfo = async (): Promise<void> => {
    const sketchLibrary: SketchLibrary = {}
    for (const sketchId of sketchLibraryIds) {
      const configModule = await import(
        /* @vite-ignore */ `${base}/${sketchId}/config.js?${cacheBust}`
      )
      const sketchModule = await import(
        /* @vite-ignore */ `${base}/${sketchId}/index.js?${cacheBust}`
      )

      const name = configModule.default.defaultTitle

      sketchLibrary[sketchId] = {
        sketchId,
        name,
        module: sketchModule,
      }
    }

    const appState = useAppStore.getState()
    appState.setSketchLibrary(sketchLibrary)
    appState.setIsSketchLibraryReady()
  }

  getSketchInfo()
}
