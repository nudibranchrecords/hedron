import test from 'tape'
import proxyquire from 'proxyquire'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import createSagaMiddleware from 'redux-saga'
const sagaMiddleware = createSagaMiddleware()
import { sceneSketchCreate, sceneSketchReimport } from '../src/store/scene/actions'

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
      key: 'speed',
      isOpen: false
    }
  }, 'After creating sketch, node item is created for param')
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
        key: 'speed',
        isOpen: false
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
        key: 'speed',
        isOpen: false
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
        key: 'speed',
        isOpen: false
      },
      id_3: {
        id: 'id_3',
        title: 'Scale',
        value: 0.2,
        inputLinkIds: [],
        shotCount: 0,
        connectedMacroIds: [],
        type: 'param',
        key: 'scale',
        isOpen: false
      }
    },
   'After reimporting, new node exists'
  )

  t.end()
})

test('(mock) Sketches - Reimport Sketch (with title change)', (t) => {
  uniqueId = 2

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
        key: 'speed',
        isOpen: false
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

  console.log(state.nodes)
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
        key: 'speed',
        isOpen: false
      },
      id_3: {
        id: 'id_3',
        title: 'Scale',
        value: 0.2,
        inputLinkIds: [],
        shotCount: 0,
        connectedMacroIds: [],
        type: 'param',
        key: 'scale',
        isOpen: false
      }
    },
   'After reimporting, new node exists, old node title has changed'
  )

  t.end()
})
