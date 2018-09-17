export default (state) =>
  Object.keys(state.scenes.items).map(key => state.scenes.items[key])
