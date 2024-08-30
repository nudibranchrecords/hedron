import { render } from './renderer'
import { createDebugScene } from './debugScene'
import { loadAllSketchesFromState } from './sketches'

export const run = async (): Promise<void> => {
  const debugScene = createDebugScene()

  loadAllSketchesFromState()

  const loop = (): void => {
    requestAnimationFrame(loop)
    if (debugScene) {
      render(debugScene)
    }
  }

  loop()
}
