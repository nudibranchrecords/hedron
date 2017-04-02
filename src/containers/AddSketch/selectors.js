export const getModules = (state) => {
  return Object.keys(state.sketches.modules).map((id) => (
    {
      title: state.sketches.modules[id].defaultTitle,
      id
    }
  ))
}
