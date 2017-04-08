export function saveProject (filePath) {
  return {
    type: 'PROJECT_SAVE',
    payload: {
      filePath
    }
  }
}
