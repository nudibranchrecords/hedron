import getNode from './getNode'
import getSketch from './getSketch'
import getScene from './getScene'

// This can be an actual node or a sketch Object
export default state => {
  const isEditing = state.ui.isEditing
  let node

  if (isEditing) {
    switch (isEditing.type) {
      case 'sketchTitle':
        node = isEditing && getSketch(state, isEditing.id)
        break
      case 'sceneTitle':
        node = isEditing && getScene(state, isEditing.id)
        break
      default:
        node = isEditing && getNode(state, isEditing.id)
    }
  }

  return node
}
