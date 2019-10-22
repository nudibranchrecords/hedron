const fs = require('fs')
const path = require('path')

const args = process.argv.slice(2)
const inputPath = args[0]
const outputPath = './output'
const fileName = path.basename(inputPath)

const fix = cb => {
  fs.readFile(inputPath, (err, json) => {
    if (err) return console.error(err)

    const fixed = cb(JSON.parse(json))

    fs.writeFile(`${outputPath}/${fileName}`, JSON.stringify(fixed), function (err) {
      if (err) return console.error(err)
    })
  })
}

module.exports = {
  fix,
}

