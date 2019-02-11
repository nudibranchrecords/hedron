import getScenes from './getScenes'
import getSketch from './getSketch'

export default (state, moduleId) => {
  const items = []
  const scenes = getScenes(state)

  scenes.forEach(scene => {
    scene.sketchIds.forEach(sketchId => {
      const sketch = getSketch(state, sketchId)

      if (sketch.moduleId === moduleId) {
        items.push({
          sceneId: scene.id,
          sketchId,
        })
      }
    })
  })

  return items
}
