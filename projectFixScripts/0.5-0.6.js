/*
A script to update your project file to be compatible with v0.6
Definitely not guaranteed!

Place your project in the input folder and run this script like so:
node ./0.5-0.6 ./input/yourproject.json
The result will appear in the output folder
*/

const fs = require('fs')
const path = require('path')

const args = process.argv.slice(2)
const inputPath = args[0]
const outputPath = './output'
const fileName = path.basename(inputPath)

const parseOldOptions = (key, node) => {
  if (node[key] && node[key].length) {
    node.optionIds = node[key]
  }
  delete node[key]
}

fs.readFile(inputPath, (err, json) => {
  if (err) return console.error(err)

  const data = JSON.parse(json)
  for (const key in data.nodes) {
    const node = data.nodes[key]
    node.optionIds = []

    // option Ids have become a single array
    parseOldOptions('lfoOptionIds', node)
    parseOldOptions('midiOptionIds', node)
    parseOldOptions('audioOptionIds', node)
    parseOldOptions('animOptionIds', node)

    // We now have valueType, default is "float"
    if (node.type === 'param' && !node.valueType) {
      node.valueType = 'float'
    }
  }

  fs.writeFile(`${outputPath}/${fileName}`, JSON.stringify(data), function (err) {
    if (err) return console.error(err)
  })
})

