const defaultState = {
  clockGenerated: true,
  clockBpm: 120
}

const settingsReducer = (state = defaultState, action) => {
  const p = action.payload

  switch (action.type) {
    case 'SETTINGS_UPDATE': {
      return {
        ...state,
        ...p.items
      }
    }
    default:
      return state
  }
}

export default settingsReducer
