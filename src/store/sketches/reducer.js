import uid from 'uid'

const defaultState = {
  modules: {
    'test': {
      defaultTitle: 'Test Sketch',
      params: [
        {
          key: 'rotX',
          title: 'Rotation X',
          defaultValue: 0.5
        },
        {
          key: 'rotY',
          title: 'Rotation Y',
          defaultValue: 0.5
        }
      ]
    }
  },
  params: {},
  instances: {}
}

const sketchesReducer = (state = defaultState, action) => {
  const p = action.payload

  switch (action.type) {
    case 'SKETCHES_CREATE_INSTANCE': {
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
