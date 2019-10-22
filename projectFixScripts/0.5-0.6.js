const { fix } = require('./lib')

const parseOldOptions = (key, node) => {
  if (node[key] && node[key].length) {
    node.optionIds = node[key]
  }
  delete node[key]
}

fix(data => {
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

  return data
})

