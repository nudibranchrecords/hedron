import test from 'tape'
import deepFreeze from 'deep-freeze'
import paramsReducer from '../reducer'
import { returnsPreviousState } from '../../../testUtils'

returnsPreviousState(paramsReducer)

test('(Reducer) paramsReducer - Updates correct param value on PARAM_VALUE_UPDATE', (t) => {
  let originalState, expectedState, actualState

  originalState = {
    '01': {
      title: 'Rotation X',
      key: 'rotX',
      value: 0.1
    },
    '02': {
      title: 'Rotation Y',
      key: 'rotY',
      value: 0.2
    }
  }

  deepFreeze(originalState)

  expectedState = {
    '01': {
      title: 'Rotation X',
      key: 'rotX',
      value: 1
    },
    '02': {
      title: 'Rotation Y',
      key: 'rotY',
      value: 0.2
    }
  }

  actualState = paramsReducer(originalState, {
    type: 'PARAM_VALUE_UPDATE',
    payload: {
      id: '01',
      value: 1
    }
  })

  t.deepEqual(actualState, expectedState)

  expectedState = {
    '01': {
      title: 'Rotation X',
      key: 'rotX',
      value: 1
    },
    '02': {
      title: 'Rotation Y',
      key: 'rotY',
      value: 2
    }
  }

  actualState = paramsReducer(actualState, {
    type: 'PARAM_VALUE_UPDATE',
    payload: {
      id: '02',
      value: 2
    }
  })

  t.deepEqual(actualState, expectedState)

  t.end()
})

test('(Reducer) paramsReducer - Adds param on R_PARAM_CREATE', (t) => {
  let originalState, expectedState, actualState

  originalState = {
    '01': {
      title: 'Rotation X',
      key: 'rotX',
      value: 0.1,
      id: '01'
    },
    '02': {
      title: 'Rotation Y',
      key: 'rotY',
      value: 0.2,
      id: '02'
    }
  }

  expectedState = {
    '01': {
      title: 'Rotation X',
      key: 'rotX',
      value: 0.1,
      id: '01'
    },
    '02': {
      title: 'Rotation Y',
      key: 'rotY',
      value: 0.2,
      id: '02'
    },
    '03': {
      title: 'Rotation X',
      key: 'rotX',
      value: 0.2,
      id: '03'
    }
  }

  actualState = paramsReducer(originalState, {
    type: 'R_PARAM_CREATE',
    payload: {
      id: '03',
      param: {
        title: 'Rotation X',
        key: 'rotX',
        value: 0.2,
        id: '03'
      }
    }
  })

  t.deepEqual(actualState, expectedState)

  expectedState = {
    '01': {
      title: 'Rotation X',
      key: 'rotX',
      value: 0.1,
      id: '01'
    },
    '02': {
      title: 'Rotation Y',
      key: 'rotY',
      value: 0.2,
      id: '02'
    },
    '03': {
      title: 'Rotation X',
      key: 'rotX',
      value: 0.2,
      id: '03'
    },
    '04': {
      title: 'Scale',
      key: 'scale',
      value: 0.2,
      id: '04'
    }
  }

  actualState = paramsReducer(actualState, {
    type: 'R_PARAM_CREATE',
    payload: {
      id: '04',
      param: {
        title: 'Scale',
        key: 'scale',
        value: 0.2,
        id: '04'
      }
    }
  })

  t.deepEqual(actualState, expectedState)

  t.end()
})

test('(Reducer) paramsReducer - Removes param on PARAM_DELETE', (t) => {
  let originalState, expectedState, actualState

  originalState = {
    '01': {
      title: 'Rotation X',
      key: 'rotX',
      value: 0.1,
      id: '01'
    },
    '02': {
      title: 'Rotation Y',
      key: 'rotY',
      value: 0.2,
      id: '02'
    }
  }

  expectedState = {
    '01': {
      title: 'Rotation X',
      key: 'rotX',
      value: 0.1,
      id: '01'
    }
  }

  actualState = paramsReducer(originalState, {
    type: 'PARAM_DELETE',
    payload: {
      id: '02'
    }
  })

  t.deepEqual(actualState, expectedState)

  expectedState = {}

  actualState = paramsReducer(actualState, {
    type: 'PARAM_DELETE',
    payload: {
      id: '01'
    }
  })

  t.deepEqual(actualState, expectedState)

  t.end()
})

test('(Reducer) paramsReducer - Replaces params on PARAMS_REPLACE_ALL', (t) => {
  let originalState, actual

  const newParams = {
    sAA: {
      moduleId: 'dog',
      title: 'Dog 1',
      paramIds: ['p22', 'p02']
    },
    sBB: {
      moduleId: 'cat',
      title: 'Cat 1',
      paramIds: ['p55', 'p04']
    }
  }

  originalState = {
    s01: {
      moduleId: 'cubey',
      title: 'Cubey 1',
      paramIds: ['p01', 'p02']
    },
    s02: {
      moduleId: 'swirly',
      title: 'Swirly 1',
      paramIds: ['p03', 'p04']
    }
  }

  deepFreeze(originalState)

  actual = paramsReducer(originalState, {
    type: 'PARAMS_REPLACE_ALL',
    payload: {
      params: newParams
    }
  })

  t.deepEqual(actual, newParams, 'Replaces all params')

  t.end()
})

test('(Reducer) paramsReducer - Updates correct param value on R_PARAM_INPUT_UPDATE', (t) => {
  let originalState, expectedState, actualState

  originalState = {
    '01': {
      title: 'Rotation X',
      key: 'rotX',
      value: 0.1,
      input: {
        id: 'audio_0'
      }
    },
    '02': {
      title: 'Rotation Y',
      key: 'rotY',
      value: 0.2,
      input: undefined
    }
  }

  deepFreeze(originalState)

  expectedState = {
    '01': {
      title: 'Rotation X',
      key: 'rotX',
      value: 0.1,
      input: {
        id: 'audio_0'
      }
    },
    '02': {
      title: 'Rotation Y',
      key: 'rotY',
      value: 0.2,
      input: {
        id: 'audio_1'
      }
    }
  }

  actualState = paramsReducer(originalState, {
    type: 'R_PARAM_INPUT_UPDATE',
    payload: {
      paramId: '02',
      input: {
        id: 'audio_1'
      }
    }
  })

  t.deepEqual(actualState, expectedState)

  expectedState = {
    '01': {
      title: 'Rotation X',
      key: 'rotX',
      value: 0.1,
      input: {
        id: 'audio_3'
      }
    },
    '02': {
      title: 'Rotation Y',
      key: 'rotY',
      value: 0.2,
      input: {
        id: 'audio_1'
      }
    }
  }

  actualState = paramsReducer(actualState, {
    type: 'R_PARAM_INPUT_UPDATE',
    payload: {
      paramId: '01',
      input: {
        id: 'audio_3'
      }
    }
  })

  t.deepEqual(actualState, expectedState)

  t.end()
})

