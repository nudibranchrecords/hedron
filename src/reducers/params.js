const initialState = {
  valuesById: {
    '01': 1,
    '02': 0.5,
    '03': 0.1,
    '04': 0.2
  },
  info: {
    '01': {
      title: 'Rotation X',
      key: 'rotX'
    },
    '02': {
      title: 'Rotation Y',
      key: 'rotY'
    },
    '03': {
      title: 'Param X',
      key: 'rotX'
    },
    '04': {
      title: 'Param Y',
      key: 'rotY'
    }
  }
}

const params = (state = initialState, action) => {
  const p = action.payload

  switch (action.type) {
    case 'PARAM_VALUE_UPDATE':
      return {
        ...state,
        valuesById: {
          ...state.valuesById,
          [p.paramId]: p.value
        }
      }
    default:
      return state
  }
}

export default params
