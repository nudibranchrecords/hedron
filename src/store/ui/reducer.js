const defaultState = {
  panelWidths: {
    left: 50
  },
  isEditing: false
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
    case 'UI_EDITING_OPEN': {
      return {
        ...state,
        isEditing: {
          id: p.id,
          type: p.type
        }
      }
    }
    case 'UI_EDITING_CLOSE': {
      return {
        ...state,
        isEditing: false
      }
    }
    default:
      return state
  }
}

export default uiReducer
