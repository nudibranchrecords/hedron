export const getNewestSketchId = state => {
  const keys = Object.keys(state.sketches.instances)
  return keys[keys.length - 1]
}
