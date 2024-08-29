import { render } from './renderer'
import { createDebugScene } from './debugScene'
import { loadSketch } from './sketches'

export const run = async (): Promise<void> => {
  const debugScene = createDebugScene()

  // TODO: Actually load in sketches from state!
  const testSketch = await loadSketch('test-sketch')
  debugScene.scene.add(testSketch.root)

  const loop = (): void => {
    requestAnimationFrame(loop)
    if (debugScene) {
      render(debugScene)
    }
  }

  loop()
}
