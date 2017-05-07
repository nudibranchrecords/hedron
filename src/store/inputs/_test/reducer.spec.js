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
      inputId: 'audio_XXXX',
      value: 0.9
    }
  })

  t.deepEqual(actual, expectedState, 'does nothing if input doesnt exist in state')

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

test('(Reducer) inputsReducer - Adds node on INPUT_ASSIGNED_NODE_CREATE', (t) => {
  let actual, expectedState

  const originalState = {
    audio_0: {
      assignedNodeIds: []
    },
    audio_1: {
      assignedNodeIds: []
    }
  }

  deepFreeze(originalState)

  expectedState = {
    audio_0: {
      assignedNodeIds: ['XX']
    },
    audio_1: {
      assignedNodeIds: []
    }
  }

  actual = inputsReducer(originalState, {
    type: 'INPUT_ASSIGNED_NODE_CREATE',
    payload: {
      inputId: 'audio_0',
      nodeId: 'XX'
    }
  })

  t.deepEqual(actual, expectedState)

  expectedState = {
    audio_0: {
      assignedNodeIds: ['XX']
    },
    audio_1: {
      assignedNodeIds: ['YY']
    }
  }

  actual = inputsReducer(actual, {
    type: 'INPUT_ASSIGNED_NODE_CREATE',
    payload: {
      inputId: 'audio_1',
      nodeId: 'YY'
    }
  })

  t.deepEqual(actual, expectedState)

  expectedState = {
    audio_0: {
      assignedNodeIds: ['XX']
    },
    audio_1: {
      assignedNodeIds: ['YY', 'ZZ']
    }
  }

  actual = inputsReducer(actual, {
    type: 'INPUT_ASSIGNED_NODE_CREATE',
    payload: {
      inputId: 'audio_1',
      nodeId: 'ZZ'
    }
  })

  t.deepEqual(actual, expectedState)

  expectedState = {
    audio_0: {
      assignedNodeIds: ['XX']
    },
    audio_1: {
      assignedNodeIds: ['YY', 'ZZ']
    },
    midi_XXX: {
      assignedNodeIds: ['AA']
    }
  }

  actual = inputsReducer(actual, {
    type: 'INPUT_ASSIGNED_NODE_CREATE',
    payload: {
      inputId: 'midi_XXX',
      nodeId: 'AA'
    }
  })

  t.deepEqual(actual, expectedState, 'Adds input and assigns node when input doesnt exist')

  t.end()
})

test('(Reducer) inputsReducer - Deletes node on INPUT_ASSIGNED_NODE_DELETE', (t) => {
  let actual, expectedState

  const originalState = {
    audio_0: {
      assignedNodeIds: ['XX']
    },
    audio_1: {
      assignedNodeIds: ['YY', 'ZZ']
    }
  }

  deepFreeze(originalState)

  expectedState = {
    audio_0: {
      assignedNodeIds: ['XX']
    },
    audio_1: {
      assignedNodeIds: ['ZZ']
    }
  }

  actual = inputsReducer(originalState, {
    type: 'INPUT_ASSIGNED_NODE_DELETE',
    payload: {
      inputId: 'audio_1',
      nodeId: 'YY'
    }
  })

  t.deepEqual(actual, expectedState)

  expectedState = {
    audio_0: {
      assignedNodeIds: []
    },
    audio_1: {
      assignedNodeIds: ['ZZ']
    }
  }

  actual = inputsReducer(actual, {
    type: 'INPUT_ASSIGNED_NODE_DELETE',
    payload: {
      inputId: 'audio_0',
      nodeId: 'XX'
    }
  })

  t.deepEqual(actual, expectedState)

  t.end()
})
