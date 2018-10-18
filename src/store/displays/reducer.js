const defaultState = {
  list: [],
}

const displaysReducer = (state = defaultState, action) => {
  const p = action.payload

  switch (action.type) {
    case 'DISPLAYS_LIST_UPDATE': {
      return {
        ...state,
        list: p.deviceList,
      }
    }
    default:
      return state
  }
}

export default displaysReducer
