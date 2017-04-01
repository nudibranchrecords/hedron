const initialState = {
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
}

const paramsReducer = (state = initialState, action) => {
  const p = action.payload

  switch (action.type) {
    case 'PARAM_VALUE_UPDATE':
      return {
        ...state,
        [p.paramId]: {
          ...state[p.paramId],
          value: p.value
        }
      }
    default:
      return state
  }
}

export default paramsReducer
