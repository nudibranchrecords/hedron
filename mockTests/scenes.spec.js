import test from 'tape'
import proxyquire from 'proxyquire'
import listen from 'redux-action-listeners'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import createSagaMiddleware from 'redux-saga'
const sagaMiddleware = createSagaMiddleware()
import { uSceneCreate, uSceneDelete } from '../src/store/scenes/actions'

import { fork } from 'redux-saga/effects'
import { watchNodes } from '../src/store/nodes/sagas'
import sketchesReducer from '../src/store/sketches/reducer'
import scenesReducer from '../src/store/scenes/reducer'
import nodesReducer from '../src/store/nodes/reducer'

const rootReducer = combineReducers(
  {
    nodes: nodesReducer,
    sketches: sketchesReducer,
    scenes: scenesReducer
  }
)

let uniqueId
const uid = () => {
  uniqueId++
  return 'id_' + uniqueId
}

const { watchSketches } = proxyquire('../src/store/sketches/sagas', {
  'uid': uid
})

const scenesListener = proxyquire('../src/store/scenes/listener', {
  'uid': uid
}).default

function* rootSaga (dispatch) {
  yield [
    fork(watchSketches),
    fork(watchNodes)
  ]
}

const rootListener = {
  types: 'all',

  handleAction (action, dispatched, store) {
    scenesListener(action, store)
  }
}

test('(mock) Scenes - Add Scene', (t) => {
  uniqueId = 0

  const store = createStore(rootReducer, {
    nodes: {},
    sketches: {}
  }, applyMiddleware(sagaMiddleware, listen(rootListener)))
  sagaMiddleware.run(rootSaga, store.dispatch)

  let state

  state = store.getState()
  t.deepEqual(state.scenes, { items: {} }, 'scenes start with empty items')

  store.dispatch(uSceneCreate())
  state = store.getState()
  t.deepEqual(state.scenes,
    {
      items: {
        id_1: {
          id: 'id_1',
          sketchIds: []
        }
      }
    },
  'scene is added to items list when sceneCreate is dispatched')

  store.dispatch(uSceneCreate())
  state = store.getState()
  t.deepEqual(state.scenes,
    {
      items: {
        id_1: {
          id: 'id_1',
          sketchIds: []
        },
        id_2: {
          id: 'id_2',
          sketchIds: []
        }
      }
    },
  'scene is added to items list when sceneCreate is dispatched')

  t.end()
})

test('(mock) Scenes - Delete Scene', (t) => {
  const store = createStore(rootReducer, {
    nodes: {
      node_01: {},
      node_02: {},
      node_03: {}
    },
    sketches: {
      sketch_01: {
        title: 'Foo',
        moduleId: 'foo',
        paramIds: [],
        shotIds: [],
        openedNodes: {}
      },
      sketch_02: {
        title: 'Bar',
        moduleId: 'bar',
        paramIds: ['node_01', 'node_02'],
        shotIds: ['node_03'],
        openedNodes: {}
      }
    },
    scenes: {
      items: {
        id_1: {
          id: 'id_1',
          sketchIds: []
        },
        id_2: {
          id: 'id_2',
          sketchIds: ['sketch_01', 'sketch_02']
        }
      }
    }
  }, applyMiddleware(sagaMiddleware, listen(rootListener)))
  sagaMiddleware.run(rootSaga, store.dispatch)

  let state

  store.dispatch(uSceneDelete('id_1'))
  state = store.getState()
  t.deepEqual(state.scenes,
    {
      items: {
        id_2: {
          id: 'id_2',
          sketchIds: ['sketch_01', 'sketch_02']
        }
      }
    },
  'Scene deleted with no sketches just removes that scene')
  t.equal(Object.keys(state.nodes).length, 3, 'Nodes kept the same')
  t.equal(Object.keys(state.sketches).length, 2, 'Sketches kept the same')

  store.dispatch(uSceneDelete('id_2'))
  state = store.getState()
  t.deepEqual(state,
    {
      nodes: {},
      sketches: {},
      scenes: {
        items: {}
      }
    },
  'Scene with sketches, when deleted, removes all sketches and related nodes')

  t.end()
})
