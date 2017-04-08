export function projectSave () {
  return {
    type: 'PROJECT_SAVE'
  }
}

export function projectFilepathUpdate (filePath) {
  return {
    type: 'PROJECT_FILEPATH_UPDATE',
    payload: {
      filePath
    }
  }
}
