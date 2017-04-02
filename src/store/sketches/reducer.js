import uid from 'uid'
import _ from 'lodash'

const defaultState = {
  modules: {},
  params: {},
  instances: {}
}

const sketchesReducer = (state = defaultState, action) => {
  const p = action.payload

  switch (action.type) {
    case 'SKETCHES_MODULES_UPDATE': {
      return {
        ...state,
        modules: p.modules
      }
    }
    case 'SKETCHES_INSTANCE_CREATE': {
      const sketchId = uid()
      const module = state.modules[p.moduleId]

      let params = state.params
      let paramIds = []

      module.params.forEach(param => {
        const id = uid()
        paramIds.push(id)
        params = {
          ...params,
          [id]: {
            title: param.title,
            value: param.defaultValue,
            key: param.key
          }
        }
      })

      return {
        ...state,
        instances: {
          ...state.instances,
          [sketchId] : {
            title: module.defaultTitle,
            moduleId: p.moduleId,
            paramIds
          }
        },
        params
      }
    }
    case 'SKETCHES_INSTANCE_DELETE': {
      return {
        ...state,
        instances: _.omit(state.instances, [p.id])
      }
    }
    case 'SKETCHES_PARAM_VALUE_UPDATE':
      return {
        ...state,
        params: {
          ...state.params,
          [p.id]: {
            ...state.params[p.id],
            value: p.value
          }
        }
      }
    default:
      return state
  }
}

export default sketchesReducer
