import { uid } from 'uid'
import { getSketchesServerUrl } from './globals'
import { SketchLibrary, useAppStore } from './sketchesState'

export const initiateSketchLibrary = (sketchLibraryIds: string[]): void => {
  const base = getSketchesServerUrl()
  const cacheBust = uid()

  const getSketchInfo = async (): Promise<void> => {
    const sketchLibrary: SketchLibrary = {}
    for (const sketchId of sketchLibraryIds) {
      const module = await import(/* @vite-ignore */ `${base}/${sketchId}/config.js?${cacheBust}`)

      const name = module.default.defaultTitle

      sketchLibrary[sketchId] = {
        sketchId,
        name,
      }

      console.log(sketchLibrary)
    }

    useAppStore.getState().setSketchLibrary(sketchLibrary)
  }

  getSketchInfo()
}
