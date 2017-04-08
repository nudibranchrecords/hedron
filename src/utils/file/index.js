import jsonfile from 'jsonfile'

export const save = (path, data) => {
  jsonfile.writeFile(path, data, (err) => {
    if (err) {
      console.error(err)
      throw err
    }
  })
}
