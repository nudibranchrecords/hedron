const popupTypes = ['nodeTitle', 'sketchTitle', 'sceneTitle']

// Some "isEditing" will open a popup, others will not
export default state => {
  const type = state.ui.isEditing.type
  let mode

  if (popupTypes.includes(type)) {
    mode = 'popup'
  }

  return mode
}
