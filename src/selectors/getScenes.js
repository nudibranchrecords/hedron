export default (state) =>
  state.scenes.sceneIds.map(id => state.scenes.items[id])
