import { SketchEvents } from '../shared/Events'
import { refreshSketch } from './engine/sketches'
import { run } from './engine'
import { getSketchesServerUrl, setSketchesServerUrl } from './engine/globals'
import { SketchLibrary, useAppStore } from './engine/sketchesState'
import { uid } from 'uid'

const listen = (event: string, cb: (info: any) => void): void => {
  window.electron.ipcRenderer.on(event, (_, info) => {
    cb(info)
  })
}

listen(SketchEvents.InitialSketchIds, (sketchIds: string[]) => {
  const base = getSketchesServerUrl()
  const cacheBust = uid()

  const getSketchInfo = async (): Promise<void> => {
    const sketchLibrary: SketchLibrary = {}
    for (const sketchId of sketchIds) {
      console.log(sketchId)
      const module = await import(/* @vite-ignore */ `${base}/${sketchId}/config.js?${cacheBust}`)

      const name = module.default.defaultTitle

      sketchLibrary[sketchId] = {
        sketchId,
        name,
      }

      useAppStore.getState().setSketchLibrary(sketchLibrary)
    }
  }

  getSketchInfo()
})

listen(SketchEvents.ServerStart, (sketchesServerUrl: string) => {
  setSketchesServerUrl(sketchesServerUrl)
  run()
})

listen(SketchEvents.RefreshSketch, (sketchId: string) => {
  refreshSketch(sketchId)
})
