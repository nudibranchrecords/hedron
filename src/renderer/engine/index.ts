import { render } from './renderer'
import { createDebugScene } from './debugScene'

export const run = async (): Promise<void> => {
  const debugScene = createDebugScene()

  const loop = (): void => {
    requestAnimationFrame(loop)
    if (debugScene) {
      render(debugScene)
    }
  }

  loop()
}
