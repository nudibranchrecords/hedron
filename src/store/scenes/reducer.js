import _ from 'lodash'
import arrayMove from 'array-move'

const defaultState = {
  items: {},
  sceneIds: [],
  currentSceneId: false,
  channels: {
    A: false,
    B: false,
  },
}

const scenesReducer = (state = defaultState, action) => {
  const p = action.payload

  switch (action.type) {
    case 'R_SCENE_SELECT_CHANNEL': {
      return {
        ...state,
        channels: {
          ...state.channels,
          [p.channel]: p.id,
        },
      }
    }
    case 'R_SCENE_SELECT_CURRENT': {
      return {
        ...state,
        currentSceneId: p.id,
      }
    }
    case 'R_SCENE_CREATE': {
      return {
        ...state,
        sceneIds: [...state.sceneIds, p.id],
        items: {
          ...state.items,
          [p.id]: p.scene,
        },
      }
    }
    case 'R_SCENE_DELETE': {
      return {
        ...state,
        sceneIds: state.sceneIds.filter(item => item !== p.id),
        items: _.omit(state.items, [p.id]),
      }
    }
    case 'R_SCENE_SKETCH_ADD': {
      return {
        ...state,
        items: {
          ...state.items,
          [p.id]: {
            ...state.items[p.id],
            sketchIds: _.union(state.items[p.id].sketchIds, [p.sketchId]),
          },
        },
      }
    }
    case 'R_SCENE_SKETCH_REMOVE': {
      return {
        ...state,
        items: {
          ...state.items,
          [p.id]: {
            ...state.items[p.id],
            sketchIds: state.items[p.id].sketchIds.filter(item => item !== p.sketchId),
          },
        },
      }
    }
    case 'R_SCENE_SKETCHES_REORDER': {
      return {
        ...state,
        items: {
          ...state.items,
          [p.id]: {
            ...state.items[p.id],
            sketchIds: arrayMove(state.items[p.id].sketchIds, p.oldIndex, p.newIndex),
          },
        },
      }
    }
    case 'R_SCENES_REORDER': {
      return {
        ...state,
        sceneIds: arrayMove(state.sceneIds, p.oldIndex, p.newIndex),
      }
    }
    case 'SCENE_RENAME': {
      return {
        ...state,
        items: {
          ...state.items,
          [p.id]: {
            ...state.items[p.id],
            title: p.title,
          },
        },
      }
    }
    case 'SCENE_SKETCH_SELECT': {
      return {
        ...state,
        items: {
          ...state.items,
          [p.id]: {
            ...state.items[p.id],
            selectedSketchId: p.sketchId,
          },
        },
      }
    }
    case 'R_SCENE_SETTINGS_UPDATE': {
      return {
        ...state,
        items: {
          ...state.items,
          [p.id]: {
            ...state.items[p.id],
            settings: {
              ...state.items[p.id].settings,
              ...p.settings,
            },
          },
        },
      }
    }
    default:
      return state
  }
}

export default scenesReducer
