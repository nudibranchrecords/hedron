export const getModules = (state) => {
  return Object.keys(state.availableModules).map((id) => (
    {
      title: state.availableModules[id].defaultTitle,
      category: state.availableModules[id].category,
      author: state.availableModules[id].author,
      label: state.availableModules[id].label,
      description: state.availableModules[id].description,
      id,
    }
  ))
}
