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

    if (!node.optionIds) {
      // option Ids now share the same array property
      node.optionIds = []
      parseOldOptions('lfoOptionIds', node)
      parseOldOptions('midiOptionIds', node)
      parseOldOptions('audioOptionIds', node)
      parseOldOptions('animOptionIds', node)
    }

    // We now have valueType, default is "float"
    const becomeFloat = ['param', 'macro', 'macroTargetParamLink']
    if (!node.valueType && becomeFloat.includes(node.type)) node.valueType = 'float'

    // Shots become shotFloat
    if (node.type === 'shot') {
      node.valueType = 'shotFloat'
    }

    // Selects become enums
    if (node.type === 'select') {
      delete node.type
      node.valueType = 'enum'
    }

    // Convert macro param link start values from "false" to "null"
    if (node.type === 'macro' && node.targetParamLinks) {
      for (let key in node.targetParamLinks) {
        const obj = node.targetParamLinks[key]
        if (obj.startValue === false) obj.startValue = null
      }
    }

    // Channel change action payload property from "type" to "channel"
    if (
      node.type === 'linkableAction' &&
      node.action &&
      node.action.type === 'U_SCENE_SELECT_CHANNEL' &&
      node.action.payload && node.action.payload.type &&
      !node.action.payload.channel
    ) {
      const p = node.action.payload
      const channel = p.type
      delete p.type
      p.channel = channel
    }
  }

  return data
})

