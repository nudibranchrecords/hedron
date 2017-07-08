import test from 'tape'
import deepFreeze from 'deep-freeze'
import nodesReducer from '../reducer'
import { returnsPreviousState } from '../../../testUtils'
import * as a from '../actions'

returnsPreviousState(nodesReducer)

test('(Reducer) nodesReducer - Updates correct node value on NODE_VALUE_UPDATE', (t) => {
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

  actualState = nodesReducer(originalState, {
    type: 'NODE_VALUE_UPDATE',
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

  actualState = nodesReducer(actualState, {
    type: 'NODE_VALUE_UPDATE',
    payload: {
      id: '02',
      value: 2
    }
  })

  t.deepEqual(actualState, expectedState)

  t.end()
})

test('(Reducer) nodesReducer - Adds input link id on nodeInputLinkAdd()', (t) => {
  let originalState, actualState

  originalState = {
    '01': {
      title: 'Rotation X',
      key: 'rotX',
      value: 0.1,
      inputLinkIds: []
    },
    '02': {
      title: 'Rotation Y',
      key: 'rotY',
      value: 0.2,
      inputLinkIds: []
    }
  }

  deepFreeze(originalState)

  actualState = nodesReducer(originalState, a.nodeInputLinkAdd('01', 'XXX'))

  t.deepEqual(actualState['01'].inputLinkIds, ['XXX'])

  actualState = nodesReducer(actualState, a.nodeInputLinkAdd('01', 'YYY'))

  t.deepEqual(actualState['01'].inputLinkIds, ['XXX', 'YYY'])

  actualState = nodesReducer(actualState, a.nodeInputLinkAdd('02', 'AAA'))

  t.deepEqual(actualState['02'].inputLinkIds, ['AAA'])

  t.end()
})

test('(Reducer) nodesReducer - Adds node on R_NODE_CREATE', (t) => {
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

  actualState = nodesReducer(originalState, {
    type: 'R_NODE_CREATE',
    payload: {
      id: '03',
      node: {
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

  actualState = nodesReducer(actualState, {
    type: 'R_NODE_CREATE',
    payload: {
      id: '04',
      node: {
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

test('(Reducer) nodesReducer - Removes node on R_NODE_DELETE', (t) => {
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

  actualState = nodesReducer(originalState, {
    type: 'R_NODE_DELETE',
    payload: {
      id: '02'
    }
  })

  t.deepEqual(actualState, expectedState)

  expectedState = {}

  actualState = nodesReducer(actualState, {
    type: 'R_NODE_DELETE',
    payload: {
      id: '01'
    }
  })

  t.deepEqual(actualState, expectedState)

  t.end()
})

test('(Reducer) nodesReducer - Replaces nodes on NODES_REPLACE_ALL', (t) => {
  let originalState, actual

  const newNodes = {
    sAA: {
      moduleId: 'dog',
      title: 'Dog 1',
      nodeIds: ['p22', 'p02']
    },
    sBB: {
      moduleId: 'cat',
      title: 'Cat 1',
      nodeIds: ['p55', 'p04']
    }
  }

  originalState = {
    s01: {
      moduleId: 'cubey',
      title: 'Cubey 1',
      nodeIds: ['p01', 'p02']
    },
    s02: {
      moduleId: 'swirly',
      title: 'Swirly 1',
      nodeIds: ['p03', 'p04']
    }
  }

  deepFreeze(originalState)

  actual = nodesReducer(originalState, {
    type: 'NODES_REPLACE_ALL',
    payload: {
      nodes: newNodes
    }
  })

  t.deepEqual(actual, newNodes, 'Replaces all nodes')

  t.end()
})

test('(Reducer) nodesReducer - Updates correct node value on R_NODE_INPUT_UPDATE', (t) => {
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

  actualState = nodesReducer(originalState, {
    type: 'R_NODE_INPUT_UPDATE',
    payload: {
      nodeId: '02',
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

  actualState = nodesReducer(actualState, {
    type: 'R_NODE_INPUT_UPDATE',
    payload: {
      nodeId: '01',
      input: {
        id: 'audio_3'
      }
    }
  })

  t.deepEqual(actualState, expectedState)

  t.end()
})

test('(Reducer) nodesReducer - opens/closes node on NODE_OPEN_TOGGLE', (t) => {
  let originalState, expectedState, actualState

  originalState = {
    '01': {
      title: 'Rotation X',
      key: 'rotX',
      value: 0.1,
      isOpen: true,
      input: {
        id: 'audio_0'
      }
    },
    '02': {
      title: 'Rotation Y',
      key: 'rotY',
      isOpen: false,
      input: undefined
    }
  }

  deepFreeze(originalState)

  expectedState = {
    '01': {
      title: 'Rotation X',
      key: 'rotX',
      value: 0.1,
      isOpen: true,
      input: {
        id: 'audio_0'
      }
    },
    '02': {
      title: 'Rotation Y',
      key: 'rotY',
      isOpen: true,
      input: undefined
    }
  }

  actualState = nodesReducer(originalState, {
    type: 'NODE_OPEN_TOGGLE',
    payload: {
      id: '02'
    }
  })

  t.deepEqual(actualState, expectedState)

  expectedState = {
    '01': {
      title: 'Rotation X',
      key: 'rotX',
      value: 0.1,
      isOpen: false,
      input: {
        id: 'audio_0'
      }
    },
    '02': {
      title: 'Rotation Y',
      key: 'rotY',
      isOpen: true,
      input: undefined
    }
  }

  actualState = nodesReducer(actualState, {
    type: 'NODE_OPEN_TOGGLE',
    payload: {
      id: '01'
    }
  })

  t.deepEqual(actualState, expectedState)

  t.end()
})
