import test from 'tape'
import proxyquire from 'proxyquire'
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import rootReducer from '../src/store/rootReducer'
const sagaMiddleware = createSagaMiddleware()
import { sceneSketchCreate } from '../src/store/scene/actions'

import { fork } from 'redux-saga/effects'
import { watchNodes } from '../src/store/nodes/sagas'

function uid () {
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

let uniqueId = 0

uid['@runtimeGlobal'] = true

test('(mock) Sketches - Add Sketch', (t) => {
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
