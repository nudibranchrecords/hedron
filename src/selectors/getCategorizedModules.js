function getStringCategory (state, id, sortParameter, looseItems, categorizedItems) {
  const item = {
    id,
    title: state.availableModules[id].defaultTitle,
    ...state.availableModules[id],
  }
  if (item[sortParameter] === undefined) {
    looseItems.push(item)
  } else {
    const existingCatItem = categorizedItems[0].categories.find(catItem => catItem.id === item[sortParameter])

    if (existingCatItem) {
      existingCatItem.items.push(item)
    } else {
      const newCatItem = {
        id: item[sortParameter],
        title: item[sortParameter],
        items: [
          item,
        ],
      }
      categorizedItems[0].categories.push(newCatItem)
    }
  }
}

function getArrayCategory (state, id, sortParameter, looseItems, categorizedItems) {
  const item = {
    id,
    title: state.availableModules[id].defaultTitle,
    ...state.availableModules[id],
  }
  if (item[sortParameter] === undefined || item[sortParameter].length === 0) {
    looseItems.push(item)
  } else {
    let categorizedItem = categorizedItems[0]
    for (let i = 0; i < item[sortParameter].length; i++) {
      const existingCatItem = categorizedItem.categories.find(catItem => catItem.id === item[sortParameter][i])
      if (existingCatItem) {
        categorizedItem = existingCatItem
      } else {
        const newCatItem = {
          id: item[sortParameter][i],
          title: item[sortParameter][i],
          items: [],
          categories:[],
        }
        categorizedItem.categories.push(newCatItem)
        categorizedItem = newCatItem
      }
    }
    categorizedItem.items.push(item)
  }
}

export default (state) => {
  const looseItems = []
  let categorizedItems = [{ title:'root', id:'root', items:[], categories:[] }]

  if (state.nodes['sketchOrganization'].value === 'folder') {
    Object.keys(state.availableModules).forEach((id) => {
      getArrayCategory(state, id, 'filePathArray', looseItems, categorizedItems)
    })
  } else {
    Object.keys(state.availableModules).forEach((id) => {
      getStringCategory(state, id, state.nodes['sketchOrganization'].value, looseItems, categorizedItems)
    })
  }
  return {
    looseItems,
    categorizedItems,
  }
}
