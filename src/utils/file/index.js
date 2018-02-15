import jsonfile from 'jsonfile'

export const save = (path, data) => {
  jsonfile.writeFile(path, data, (err) => {
    if (err) {
      console.error(err)
      throw new Error(err)
    }
  })
}

export const load = (path) => {
  return new Promise((resolve, reject) => {
    jsonfile.readFile(path, (err, obj) => {
      if (err) {
        reject(err)
      } else {
        resolve(obj)
      }
    })
  })
}
