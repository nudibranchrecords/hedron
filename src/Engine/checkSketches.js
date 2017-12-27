import allModules from 'sketches'
import world from './world'

export default (sketches, state) => {
  // Check state sketches
  const sketchKeys = Object.keys(state.sketches)

  // Add sketch if state has one more  sketch
  if (sketches.length === sketchKeys.length - 1) {
    const key = sketchKeys[sketches.length]
    const newSketch = state.sketches.instances[key]
    const moduleId = newSketch.moduleId
    const module = new allModules[moduleId].Module()

    sketches.push({
      id: key,
      module
    })

    world.scene.add(module.root)
  }

  // Remove sketch if state has one less sketch
  if (sketches.length === sketchKeys.length + 1) {
    sketches.forEach((sketch, index) => {
      if (sketchKeys.indexOf(sketch.id) === -1) {
        world.scene.remove(sketch.module.root)
        sketches.splice(index, 1)
      }
    })
  }

  return sketches
}
