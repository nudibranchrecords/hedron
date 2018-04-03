import { LOCATION_CHANGE } from 'react-router-redux'

const defaultState = {
  panelWidths: {
    left: 50
  },
  isEditing: false,
  openedNode: false
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
    case 'UI_EDITING_TOGGLE': {
      return {
        ...state,
        isEditing: state.isEditing
          ? false
          : {
            id: p.id,
            type: p.type
          }
      }
    }
    case 'UI_EDITING_CLOSE':
    case LOCATION_CHANGE:
      {
        return {
          ...state,
          isEditing: false
        }
      }
    case 'UI_NODE_TOGGLE_OPEN': {
      return {
        ...state,
        openedNode: p.id === state.openedNode ? false : p.id
      }
    }
    default:
      return state
  }
}

export default uiReducer
