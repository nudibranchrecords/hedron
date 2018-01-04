const defaultState = {
  panelWidths: {
    left: 50
  }
}

const uiReducer = (state = defaultState, action) => {
  const p = action.payload

  switch (action.type) {
    case 'UI_PANEL_RESIZE': {
      return {
        ...state,
        panelWidths: {
          ...state.panelWidths,
          left: p.value
        }
      }
    }
    default:
      return state
  }
}

export default uiReducer
