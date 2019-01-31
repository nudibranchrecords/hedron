export const getModules = (state) => {
  return Object.keys(state.availableModules).map((id) => (
    {
      title: state.availableModules[id].defaultTitle,
      category: state.availableModules[id].category,
      author: state.availableModules[id].author,
      description: state.availableModules[id].description,
      filePath: state.availableModules[id].filePath,
      id,
    }
  ))
}
