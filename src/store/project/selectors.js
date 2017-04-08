export const getProjectData = state => ({
  sketches: {
    instances: state.sketches.instances,
    params: state.sketches.params
  },
  project: state.project
})

export const getProjectFilepath = state =>
  state.project.filePath
