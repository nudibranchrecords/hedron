import _ from 'lodash'

export const getProjectData = state =>
  _.omit(state, ['availableModules', 'midi', 'displays', 'clock'])

export const getProjectFilepath = state =>
  state.project.filePath
