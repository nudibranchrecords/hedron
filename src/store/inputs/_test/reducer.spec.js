import test from 'tape'
import inputsReducer from '../reducer'
import deepFreeze from 'deep-freeze'

import { returnsPreviousState } from '../../../testUtils'
returnsPreviousState(inputsReducer)

test('(Reducer) inputsReducer - Updates value on INPUT_FIRED', (t) => {
  let actual, expectedState

  const originalState = {
    audio_0: {
      value: 0
    },
    audio_1: {
      value: 0
    }
  }

  expectedState = {
    audio_0: {
      value: 0.9
    },
    audio_1: {
      value: 0
    }
  }

  actual = inputsReducer(originalState, {
    type: 'INPUT_FIRED',
    payload: {
      inputId: 'audio_0',
      value: 0.9
    }
  })

  t.deepEqual(actual, expectedState)

  expectedState = {
    audio_0: {
      value: 0.9
    },
    audio_1: {
      value: 0.4
    }
  }

  actual = inputsReducer(actual, {
    type: 'INPUT_FIRED',
    payload: {
      inputId: 'audio_1',
      value: 0.4
    }
  })

  t.deepEqual(actual, expectedState)

  t.end()
})

test('(Reducer) inputsReducer - Replaces all on INPUTS_REPLACE_ALL', (t) => {
  let actual, expectedState

  const originalState = {
    audio_0: {
      value: 0
    },
    audio_1: {
      value: 0
    }
  }

  deepFreeze(originalState)

  expectedState = {
    audio_X: {
      value: 0.9
    },
    audio_T: {
      value: 0.5
    }
  }

  actual = inputsReducer(originalState, {
    type: 'INPUTS_REPLACE_ALL',
    payload: {
      inputs: expectedState
    }
  })

  t.deepEqual(actual, expectedState)

  t.end()
})

test('(Reducer) inputsReducer - Adds param on INPUT_ASSIGNED_PARAM_CREATE', (t) => {
  let actual, expectedState

  const originalState = {
    audio_0: {
      assignedParamIds: []
    },
    audio_1: {
      assignedParamIds: []
    }
  }

  deepFreeze(originalState)

  expectedState = {
    audio_0: {
      assignedParamIds: ['XX']
    },
    audio_1: {
      assignedParamIds: []
    }
  }

  actual = inputsReducer(originalState, {
    type: 'INPUT_ASSIGNED_PARAM_CREATE',
    payload: {
      inputId: 'audio_0',
      paramId: 'XX'
    }
  })

  t.deepEqual(actual, expectedState)

  expectedState = {
    audio_0: {
      assignedParamIds: ['XX']
    },
    audio_1: {
      assignedParamIds: ['YY']
    }
  }

  actual = inputsReducer(actual, {
    type: 'INPUT_ASSIGNED_PARAM_CREATE',
    payload: {
      inputId: 'audio_1',
      paramId: 'YY'
    }
  })

  t.deepEqual(actual, expectedState)

  expectedState = {
    audio_0: {
      assignedParamIds: ['XX']
    },
    audio_1: {
      assignedParamIds: ['YY', 'ZZ']
    }
  }

  actual = inputsReducer(actual, {
    type: 'INPUT_ASSIGNED_PARAM_CREATE',
    payload: {
      inputId: 'audio_1',
      paramId: 'ZZ'
    }
  })

  t.deepEqual(actual, expectedState)

  t.end()
})

test('(Reducer) inputsReducer - Deletes param on INPUT_ASSIGNED_PARAM_DELETE', (t) => {
  let actual, expectedState

  const originalState = {
    audio_0: {
      assignedParamIds: ['XX']
    },
    audio_1: {
      assignedParamIds: ['YY', 'ZZ']
    }
  }

  deepFreeze(originalState)

  expectedState = {
    audio_0: {
      assignedParamIds: ['XX']
    },
    audio_1: {
      assignedParamIds: ['ZZ']
    }
  }

  actual = inputsReducer(originalState, {
    type: 'INPUT_ASSIGNED_PARAM_DELETE',
    payload: {
      inputId: 'audio_1',
      paramId: 'YY'
    }
  })

  t.deepEqual(actual, expectedState)

  expectedState = {
    audio_0: {
      assignedParamIds: []
    },
    audio_1: {
      assignedParamIds: ['ZZ']
    }
  }

  actual = inputsReducer(actual, {
    type: 'INPUT_ASSIGNED_PARAM_DELETE',
    payload: {
      inputId: 'audio_0',
      paramId: 'XX'
    }
  })

  t.deepEqual(actual, expectedState)

  t.end()
})
