import test from 'tape'
import proxyquire from 'proxyquire'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import createSagaMiddleware from 'redux-saga'
const sagaMiddleware = createSagaMiddleware()
import { sceneSketchCreate, sceneSketchDelete, sceneSketchReimport } from '../src/store/scene/actions'

import { fork } from 'redux-saga/effects'
import { watchNodes } from '../src/store/nodes/sagas'
import sketchesReducer from '../src/store/sketches/reducer'
import availableModulesReducer from '../src/store/availableModules/reducer'
import nodesReducer from '../src/store/nodes/reducer'

const rootReducer = combineReducers(
  {
    nodes: nodesReducer,
    availableModules: availableModulesReducer,
    sketches: sketchesReducer
  }
)

let uniqueId
const uid = () => {
  uniqueId++
  return 'id_' + uniqueId
}

const { watchScene } = proxyquire('../src/store/scene/sagas', {
  'uid': uid
})

function* rootSaga (dispatch) {
  yield [
    fork(watchScene),
    fork(watchNodes)
  ]
}

test('(mock) Sketches - Add Sketch', (t) => {
  uniqueId = 0

  const store = createStore(rootReducer, {
    availableModules: {
      foo: {
        defaultTitle: 'Foo',
        params: [
          {
            key: 'speed',
            title: 'Speed',
            defaultValue: 0.5
          }
        ],
        shots: []
      },
      bar: {
        defaultTitle: 'Bar',
        params: [
          {
            key: 'scale',
            title: 'Scale',
            defaultValue: 0.2
          },
          {
            key: 'color',
            title: 'Color',
            defaultValue: 0.1
          }
        ],
        shots: [
          {
            method: 'explode',
            title: 'Explode'
          }
        ]
      },
      boring: {
        defaultTitle: 'Boring'
      }
    },
    nodes: {},
    sketches: {}
  }, applyMiddleware(sagaMiddleware))
  sagaMiddleware.run(rootSaga, store.dispatch)

  let state

  state = store.getState()
  t.deepEqual(state.nodes, {}, 'nodes start empty')

  store.dispatch(sceneSketchCreate('foo'))
  state = store.getState()

  t.deepEqual(state.sketches, {
    id_1: {
      title: 'Foo',
      moduleId: 'foo',
      paramIds: ['id_2'],
      shotIds: [],
      openedNodes: {}
    }
  }, 'After creating sketch, sketch item is created')

  t.deepEqual(state.nodes, {
    id_2: {
      id: 'id_2',
      title: 'Speed',
      value: 0.5,
      inputLinkIds: [],
      shotCount: 0,
      connectedMacroIds: [],
      type: 'param',
      key: 'speed'
    }
  }, 'After creating sketch, node item is created for param')

  store.dispatch(sceneSketchCreate('bar'))
  state = store.getState()

  t.deepEqual(state.sketches, {
    id_1: {
      title: 'Foo',
      moduleId: 'foo',
      paramIds: ['id_2'],
      shotIds: [],
      openedNodes: {}
    },
    id_3: {
      title: 'Bar',
      moduleId: 'bar',
      paramIds: ['id_4', 'id_5'],
      shotIds: ['id_6'],
      openedNodes: {}
    }
  }, 'After creating sketch, sketch item is created')

  t.deepEqual(state.nodes, {
    id_2: {
      id: 'id_2',
      title: 'Speed',
      value: 0.5,
      inputLinkIds: [],
      shotCount: 0,
      connectedMacroIds: [],
      type: 'param',
      key: 'speed'
    },
    id_4: {
      id: 'id_4',
      title: 'Scale',
      value: 0.2,
      inputLinkIds: [],
      shotCount: 0,
      connectedMacroIds: [],
      type: 'param',
      key: 'scale'
    },
    id_5: {
      id: 'id_5',
      title: 'Color',
      value: 0.1,
      inputLinkIds: [],
      shotCount: 0,
      connectedMacroIds: [],
      type: 'param',
      key: 'color'
    },
    id_6: {
      id: 'id_6',
      title: 'Explode',
      value: 0,
      inputLinkIds: [],
      shotCount: 0,
      connectedMacroIds: [],
      type: 'shot',
      method: 'explode',
      sketchId: 'id_3'
    }
  }, 'After creating sketch, node items are created for params and shot')

  store.dispatch(sceneSketchDelete('id_1'))
  state = store.getState()

  t.deepEqual(state.sketches, {
    id_3: {
      title: 'Bar',
      moduleId: 'bar',
      paramIds: ['id_4', 'id_5'],
      shotIds: ['id_6'],
      openedNodes: {}
    }
  }, 'After deleting sketch, sketch item is removed')

  t.deepEqual(state.nodes, {
    id_4: {
      id: 'id_4',
      title: 'Scale',
      value: 0.2,
      inputLinkIds: [],
      shotCount: 0,
      connectedMacroIds: [],
      type: 'param',
      key: 'scale'
    },
    id_5: {
      id: 'id_5',
      title: 'Color',
      value: 0.1,
      inputLinkIds: [],
      shotCount: 0,
      connectedMacroIds: [],
      type: 'param',
      key: 'color'
    },
    id_6: {
      id: 'id_6',
      title: 'Explode',
      value: 0,
      inputLinkIds: [],
      shotCount: 0,
      connectedMacroIds: [],
      type: 'shot',
      method: 'explode',
      sketchId: 'id_3'
    }
  }, 'After deleting sketch, node items are removed')

  store.dispatch(sceneSketchDelete('id_3'))
  state = store.getState()

  t.deepEqual(state.sketches, {}, 'After deleting sketch, sketch item is removed')
  t.deepEqual(state.nodes, {}, 'After deleting sketch, node items are removed')

  store.dispatch(sceneSketchCreate('boring'))
  state = store.getState()

  t.deepEqual(state.sketches, {
    id_7: {
      title: 'Boring',
      moduleId: 'boring',
      paramIds: [],
      shotIds: [],
      openedNodes: {}
    }
  }, 'After creating sketch, sketch item is created')

  t.deepEqual(state.nodes, {}, 'After creating sketch, no nodes created (because sketch has no params/shots)')

  t.end()
})

test('(mock) Sketches - Reimport Sketch (Unedited sketch)', (t) => {
  uniqueId = 2

  const defaultState = {
    availableModules: {
      foo: {
        defaultTitle: 'Foo',
        params: [
          {
            key: 'speed',
            title: 'Speed',
            defaultValue: 0.5
          }
        ],
        shots: []
      }
    },
    nodes: {
      id_2: {
        id: 'id_2',
        title: 'Speed',
        value: 0.5,
        inputLinkIds: [],
        shotCount: 0,
        connectedMacroIds: [],
        type: 'param',
        key: 'speed'
      }
    },
    sketches: {
      id_1: {
        title: 'Foo',
        moduleId: 'foo',
        paramIds: ['id_2'],
        shotIds: [],
        openedNodes: {}
      }
    }
  }

  const store = createStore(rootReducer, defaultState, applyMiddleware(sagaMiddleware))
  sagaMiddleware.run(rootSaga, store.dispatch)

  let state

  store.dispatch(sceneSketchReimport('id_1'))

  state = store.getState()

  t.deepEqual(
    state, defaultState,
   'After reimporting undedited sketch, state has not changed'
  )

  t.end()
})

test('(mock) Sketches - Reimport Sketch (simple)', (t) => {
  uniqueId = 2

  const store = createStore(rootReducer, {
    availableModules: {
      foo: {
        defaultTitle: 'Foo',
        params: [
          {
            key: 'speed',
            title: 'Speed',
            defaultValue: 0.5
          },
          {
            key: 'scale',
            title: 'Scale',
            defaultValue: 0.2
          }
        ],
        shots: []
      }
    },
    nodes: {
      id_2: {
        id: 'id_2',
        title: 'Speed',
        value: 0.5,
        inputLinkIds: [],
        shotCount: 0,
        connectedMacroIds: [],
        type: 'param',
        key: 'speed'
      }
    },
    sketches: {
      id_1: {
        title: 'Foo',
        moduleId: 'foo',
        paramIds: ['id_2'],
        shotIds: [],
        openedNodes: {}
      }
    }
  }, applyMiddleware(sagaMiddleware))
  sagaMiddleware.run(rootSaga, store.dispatch)

  let state

  store.dispatch(sceneSketchReimport('id_1'))

  state = store.getState()

  t.deepEqual(
    state.sketches['id_1'].paramIds, ['id_2', 'id_3'],
   'After reimporting, sketch has new paramId'
  )

  t.deepEqual(
    state.nodes,
    {
      id_2: {
        id: 'id_2',
        title: 'Speed',
        value: 0.5,
        inputLinkIds: [],
        shotCount: 0,
        connectedMacroIds: [],
        type: 'param',
        key: 'speed'
      },
      id_3: {
        id: 'id_3',
        title: 'Scale',
        value: 0.2,
        inputLinkIds: [],
        shotCount: 0,
        connectedMacroIds: [],
        type: 'param',
        key: 'scale'
      }
    },
   'After reimporting, new node exists'
  )

  t.end()
})

test('(mock) Sketches - Reimport Sketch (params and shots)', (t) => {
  uniqueId = 3

  const store = createStore(rootReducer, {
    availableModules: {
      foo: {
        defaultTitle: 'Foo',
        params: [
          {
            key: 'speed',
            title: 'Speed',
            defaultValue: 0.5
          },
          {
            key: 'scale',
            title: 'Scale',
            defaultValue: 0.2
          }
        ],
        shots: [
          {
            method: 'explode',
            title: 'Explode'
          },
          {
            method: 'spin',
            title: 'Spin'
          }
        ]
      }
    },
    nodes: {
      id_2: {
        id: 'id_2',
        title: 'Speed',
        value: 0.5,
        inputLinkIds: [],
        shotCount: 0,
        connectedMacroIds: [],
        type: 'param',
        key: 'speed'
      },
      id_3: {
        id: 'id_3',
        title: 'Explode',
        value: 0,
        inputLinkIds: [],
        shotCount: 0,
        connectedMacroIds: [],
        type: 'shot',
        method: 'explode',
        sketchId: 'id_1'
      }
    },
    sketches: {
      id_1: {
        title: 'Foo',
        moduleId: 'foo',
        paramIds: ['id_2'],
        shotIds: ['id_3'],
        openedNodes: {}
      }
    }
  }, applyMiddleware(sagaMiddleware))
  sagaMiddleware.run(rootSaga, store.dispatch)

  let state

  store.dispatch(sceneSketchReimport('id_1'))

  state = store.getState()

  t.deepEqual(
    state.sketches['id_1'].paramIds, ['id_2', 'id_4'],
   'After reimporting, sketch has new paramId'
  )

  t.deepEqual(
    state.sketches['id_1'].shotIds, ['id_3', 'id_5'],
   'After reimporting, sketch has new shotId'
  )

  t.deepEqual(
    state.nodes,
    {
      id_2: {
        id: 'id_2',
        title: 'Speed',
        value: 0.5,
        inputLinkIds: [],
        shotCount: 0,
        connectedMacroIds: [],
        type: 'param',
        key: 'speed'
      },
      id_3: {
        id: 'id_3',
        title: 'Explode',
        value: 0,
        inputLinkIds: [],
        shotCount: 0,
        connectedMacroIds: [],
        type: 'shot',
        method: 'explode',
        sketchId: 'id_1'
      },
      id_4: {
        id: 'id_4',
        title: 'Scale',
        value: 0.2,
        inputLinkIds: [],
        shotCount: 0,
        connectedMacroIds: [],
        type: 'param',
        key: 'scale'
      },
      id_5: {
        id: 'id_5',
        title: 'Spin',
        value: 0,
        inputLinkIds: [],
        shotCount: 0,
        connectedMacroIds: [],
        type: 'shot',
        method: 'spin',
        sketchId: 'id_1'
      }
    },
   'After reimporting, new nodes exist'
  )

  t.end()
})

test('(mock) Sketches - Reimport Sketch (with shot and param title changes)', (t) => {
  uniqueId = 3

  const store = createStore(rootReducer, {
    availableModules: {
      foo: {
        defaultTitle: 'Foo',
        params: [
          {
            key: 'speed',
            title: 'Speed New',
            defaultValue: 0.5
          },
          {
            key: 'scale',
            title: 'Scale',
            defaultValue: 0.2
          }
        ],
        shots: [
          {
            method: 'explode',
            title: 'Explode New'
          }
        ]
      }
    },
    nodes: {
      id_2: {
        id: 'id_2',
        title: 'Speed',
        value: 0.5,
        inputLinkIds: [],
        shotCount: 0,
        connectedMacroIds: [],
        type: 'param',
        key: 'speed'
      },
      id_3: {
        id: 'id_3',
        title: 'Explode New',
        value: 0,
        inputLinkIds: [],
        shotCount: 0,
        connectedMacroIds: [],
        type: 'shot',
        method: 'explode',
        sketchId: 'id_1'
      }
    },
    sketches: {
      id_1: {
        title: 'Foo',
        moduleId: 'foo',
        paramIds: ['id_2'],
        shotIds: ['id_3'],
        openedNodes: {}
      }
    }
  }, applyMiddleware(sagaMiddleware))
  sagaMiddleware.run(rootSaga, store.dispatch)

  let state

  store.dispatch(sceneSketchReimport('id_1'))

  state = store.getState()

  t.deepEqual(
    state.sketches['id_1'].paramIds, ['id_2', 'id_4'],
   'After reimporting, sketch has new paramId'
  )

  t.deepEqual(
    state.nodes,
    {
      id_2: {
        id: 'id_2',
        title: 'Speed New',
        value: 0.5,
        inputLinkIds: [],
        shotCount: 0,
        connectedMacroIds: [],
        type: 'param',
        key: 'speed'
      },
      id_3: {
        id: 'id_3',
        title: 'Explode New',
        value: 0,
        inputLinkIds: [],
        shotCount: 0,
        connectedMacroIds: [],
        type: 'shot',
        method: 'explode',
        sketchId: 'id_1'
      },
      id_4: {
        id: 'id_4',
        title: 'Scale',
        value: 0.2,
        inputLinkIds: [],
        shotCount: 0,
        connectedMacroIds: [],
        type: 'param',
        key: 'scale'
      }
    },
   'After reimporting, new node exists, old nodes titles have changed'
  )

  t.end()
})

test('(mock) Sketches - Reimport Sketch (Different order)', (t) => {
  uniqueId = 3

  const store = createStore(rootReducer, {
    availableModules: {
      foo: {
        defaultTitle: 'Foo',
        params: [
          {
            key: 'speed',
            title: 'Speed',
            defaultValue: 0.5
          },
          {
            key: 'bar',
            title: 'Bar',
            defaultValue: 0.5
          },
          {
            key: 'scale',
            title: 'Scale',
            defaultValue: 0.2
          }
        ],
        shots: []
      }
    },
    nodes: {
      id_2: {
        id: 'id_2',
        title: 'Speed',
        value: 0.5,
        inputLinkIds: [],
        shotCount: 0,
        connectedMacroIds: [],
        type: 'param',
        key: 'speed'
      },
      id_3: {
        id: 'id_3',
        title: 'Scale',
        value: 0.2,
        inputLinkIds: [],
        shotCount: 0,
        connectedMacroIds: [],
        type: 'param',
        key: 'scale'
      }
    },
    sketches: {
      id_1: {
        title: 'Foo',
        moduleId: 'foo',
        paramIds: ['id_2', 'id_3'],
        shotIds: [],
        openedNodes: {}
      }
    }
  }, applyMiddleware(sagaMiddleware))
  sagaMiddleware.run(rootSaga, store.dispatch)

  let state

  store.dispatch(sceneSketchReimport('id_1'))

  state = store.getState()

  t.deepEqual(
    state.sketches['id_1'].paramIds, ['id_2', 'id_4', 'id_3'],
   'After reimporting, sketch has new paramId in middle of array'
  )

  t.deepEqual(
    state.nodes,
    {
      id_2: {
        id: 'id_2',
        title: 'Speed',
        value: 0.5,
        inputLinkIds: [],
        shotCount: 0,
        connectedMacroIds: [],
        type: 'param',
        key: 'speed'
      },
      id_3: {
        id: 'id_3',
        title: 'Scale',
        value: 0.2,
        inputLinkIds: [],
        shotCount: 0,
        connectedMacroIds: [],
        type: 'param',
        key: 'scale'
      },
      id_4: {
        id: 'id_4',
        title: 'Bar',
        value: 0.5,
        inputLinkIds: [],
        shotCount: 0,
        connectedMacroIds: [],
        type: 'param',
        key: 'bar'
      }
    },
   'After reimporting, new node exists'
  )

  t.end()
})
