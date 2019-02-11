export default (state) => {
  const looseItems = []
  const categorizedItems = []

  Object.keys(state.availableModules).forEach((id) => {
    const item = {
      id,
      title: state.availableModules[id].defaultTitle,
      ...state.availableModules[id],
    }

    if (item.category === undefined) {
      looseItems.push(item)
    } else {
      const existingCatItem = categorizedItems.find(catItem => catItem.id === item.category)

      if (existingCatItem) {
        existingCatItem.items.push(item)
      } else {
        const newCatItem = {
          id: item.category,
          title: item.category,
          items: [
            item,
          ],
        }
        categorizedItems.push(newCatItem)
      }
    }
  })

  return {
    looseItems,
    categorizedItems,
  }
}
