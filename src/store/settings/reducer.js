const defaultState = {
  clockGenerated: true,
  clockBpm: 120,
  aspectW: 16,
  aspectH: 9,
  throttledFPS: 60,
  watchSketchesDir: true,
}

const settingsReducer = (state = defaultState, action) => {
  const p = action.payload

  switch (action.type) {
    case 'SETTINGS_UPDATE': {
      return {
        ...state,
        ...p.items,
      }
    }
    default:
      return state
  }
}

export default settingsReducer
