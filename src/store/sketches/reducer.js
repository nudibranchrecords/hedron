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
  params: {
    '01': {
      title: 'Rotation X',
      key: 'rotX',
      value: 0.1
    },
    '02': {
      title: 'Rotation Y',
      key: 'rotY',
      value: 0.2
    },
    '03': {
      title: 'Rotation X',
      key: 'rotX',
      value: 0.3
    },
    '04': {
      title: 'Rotation Y',
      key: 'rotY',
      value: 0.4
    }
  },
  instances: {
    'sketch_1': {
      id: 'sketch_1',
      moduleId: 'test',
      title: 'Lorem Sketch',
      paramIds: ['01', '02']
    },
    'sketch_2': {
      id: 'sketch_2',
      moduleId: 'test',
      title: 'Ipsum Sketch',
      paramIds: ['03', '04']
    }
  }
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
