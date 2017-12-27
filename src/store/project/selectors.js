import _ from 'lodash'

export const getProjectData = state =>
  _.omit(state, ['availableModules'])

export const getProjectFilepath = state =>
  state.project.filePath
