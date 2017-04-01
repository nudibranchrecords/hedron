const defaultState = {
  modules: {
    'test': {
      defaultTitle: 'Test Sketch',
      params: {
        'rotX': {
          title: 'Rotation X',
          defaultValue: 0.5
        },
        'rotY': {
          title: 'Rotation Y',
          key: 'rotY',
          defaultValue: 0.5
        }
      }
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
      module: 'test',
      title: 'Lorem Sketch',
      params: ['01', '02']
    },
    'sketch_2': {
      id: 'sketch_2',
      module: 'test',
      title: 'Ipsum Sketch',
      params: ['03', '04']
    }
  }
}

const sketchesReducer = (state = defaultState, action) => {
  const p = action.payload

  switch (action.type) {
    case 'SKETCHES_CREATE_INSTANCE': {
      return state
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
