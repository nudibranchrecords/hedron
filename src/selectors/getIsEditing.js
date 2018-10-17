export default (state, id, type) => {
  const isEditing = state.ui.isEditing

  return isEditing &&
    isEditing.id === id &&
    isEditing.type === type
}
