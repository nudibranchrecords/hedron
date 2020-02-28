const { fix } = require('./lib')

const parseOldOptions = (key, node) => {
  if (node[key] && node[key].length) {
    node.optionIds = node[key]
  }
  delete node[key]
}

fix(data => {
  // Loop through nodes in project
  for (const key in data.nodes) {
    const node = data.nodes[key]

    if (!node.optionIds) {
      // option IDs now share the same array property
      console.log(`${node.id}: Converting option IDs into one array`)
      node.optionIds = []
      parseOldOptions('lfoOptionIds', node)
      parseOldOptions('midiOptionIds', node)
      parseOldOptions('audioOptionIds', node)
      parseOldOptions('animOptionIds', node)
    }

    // We now have valueType, default is "float"
    const becomeFloat = ['param', 'macro', 'macroTargetParamLink']
    if (!node.valueType && becomeFloat.includes(node.type)) {
      console.log(`${node.id}: ${node.type} set to "float" valueType by default`)
      node.valueType = 'float'
    }

    // Shots become shotFloat
    if (node.type === 'shot') {
      console.log(`${node.id}: added "shotFloat" valueType for shot`)
      node.valueType = 'shotFloat'
    }

    // Selects become enums
    if (node.type === 'select') {
      delete node.type
      node.valueType = 'enum'
      console.log(`${node.id}: "select" type becomes "enum" valueType`)
    }

    // Convert macro param link start values from "false" to "null"
    if (node.type === 'macro' && node.targetParamLinks) {
      for (let key in node.targetParamLinks) {
        const obj = node.targetParamLinks[key]
        if (obj.startValue === false) {
          console.log(`${node.id}: false macro start value becomes null`)
          obj.startValue = null
        }
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
      console.log(`${node.id}: linkableAction U_SCENE_SELECT_CHANNEL payload.type becomes payload.channel`)
      const p = node.action.payload
      const channel = p.type
      delete p.type
      p.channel = channel
    }
  }

  // Check if new core nodes are missing
  if (data.nodes.areErrorPopupsDisabled === undefined) {
    console.log(`adding missing areErrorPopupsDisabled core node`)
    data.nodes.areErrorPopupsDisabled = {
      title: 'Disable Error Popups',
      id: 'areErrorPopupsDisabled',
      valueType: 'boolean',
      value: false,
    }
  }

  console.log(`Checked ${Object.keys(data.nodes).length} nodes`)

  return data
})

