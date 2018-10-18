export const getModules = (state) => {
  return Object.keys(state.availableModules).map((id) => (
    {
      title: state.availableModules[id].defaultTitle,
      id,
    }
  ))
}
