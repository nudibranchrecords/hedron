import path from 'path'

export default state => {
  const modules = Object.entries(state.availableModules)

  return modules.map(([key, module]) => ({
    moduleId: key,
    filePath: path.resolve(module.filePath),
  }))
}
