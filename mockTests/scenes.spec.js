import test from 'tape'
import proxyquire from 'proxyquire'
import listen from 'redux-action-listeners'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import createSagaMiddleware from 'redux-saga'
const sagaMiddleware = createSagaMiddleware()
import { uSceneCreate, uSceneDelete, sceneSketchSelect, sceneRename } from '../src/store/scenes/actions'

import { fork } from 'redux-saga/effects'
import { watchNodes } from '../src/store/nodes/sagas'
import sketchesReducer from '../src/store/sketches/reducer'
import scenesReducer from '../src/store/scenes/reducer'
import nodesReducer from '../src/store/nodes/reducer'
import uiReducer from '../src/store/ui/reducer'
import linkableActionsReducer from '../src/store/linkableActions/reducer'
import linkableActionsListener from '../src/store/linkableActions/listener'

const rootReducer = combineReducers(
  {
    nodes: nodesReducer,
    sketches: sketchesReducer,
    scenes: scenesReducer,
    linkableActions: linkableActionsReducer
  }
)

let uniqueId
const uid = () => {
  uniqueId++
  return 'id_' + uniqueId
}

const sceneUtils = {
  generateSceneLinkableActionIds: id => ({
    foo: {
      id: 'f01',
      action: { type: 'FOO', payload: { id } }
    },
    bar: {
      id: 'b01',
      action: { type: 'BAR', payload: { id } }
    }
  })
}

const sketchesListener = proxyquire('../src/store/sketches/listener', {
  'uid': uid
}).default

const scenesListener = proxyquire('../src/store/scenes/listener', {
  'uid': uid,
  './utils': sceneUtils
}).default

function* rootSaga (dispatch) {
  yield [
    fork(watchNodes)
  ]
}

const rootListener = {
  types: 'all',

  handleAction (action, dispatched, store) {
    scenesListener(action, store)
    sketchesListener(action, store)
    linkableActionsListener(action, store)
  }
}

test('(mock) Scenes - Add Scene', (t) => {
  uniqueId = 0

  const rootReducer = combineReducers(
    {
      nodes: nodesReducer,
      sketches: sketchesReducer,
      scenes: scenesReducer,
      ui: uiReducer,
      linkableActions: linkableActionsReducer
    }
  )

  const store = createStore(rootReducer, {
    nodes: {},
    sketches: {}
  }, applyMiddleware(sagaMiddleware, listen(rootListener)))
  sagaMiddleware.run(rootSaga, store.dispatch)

  let state

  state = store.getState()
  t.deepEqual(state.scenes.items, {},
  'scenes start with empty items')

  store.dispatch(uSceneCreate())
  state = store.getState()
  t.deepEqual(state.scenes.items,
    {
      id_1: {
        id: 'id_1',
        title: 'New Scene',
        selectedSketchId: false,
        sketchIds: [],
        linkableActionIds: {
          foo: 'f01',
          bar: 'b01'
        }
      }
    },
  'scene is added to items list when sceneCreate is dispatched')

  t.equal(state.scenes.currentSceneId, 'id_1',
    'scene just created is made current'
  )

  t.deepEqual(state.scenes.channels, {
    A: 'id_1',
    B: false
  },
    'because is first scene, id_1 added to channel A'
  )

  t.deepEqual(state.linkableActions, {
    f01: {
      id: 'f01',
      action: { type: 'FOO', payload: { 'id': 'id_1' } },
      inputLinkIds: []
    },
    b01: {
      id: 'b01',
      action: { type: 'BAR', payload: { 'id': 'id_1' } },
      inputLinkIds: []
    }
  },
    'linkable actions created'
  )

  t.deepEqual(state.ui.isEditing,
    {
      id: 'id_1',
      type: 'sceneTitle'
    }
  , 'UI opens to editing scene')

  store.dispatch(uSceneCreate())
  state = store.getState()
  t.deepEqual(state.scenes.items,
    {
      id_1: {
        id: 'id_1',
        title: 'New Scene',
        selectedSketchId: false,
        sketchIds: [],
        linkableActionIds: {
          foo: 'f01',
          bar: 'b01'
        }
      },
      id_2: {
        id: 'id_2',
        title: 'New Scene',
        selectedSketchId: false,
        sketchIds: [],
        linkableActionIds: {
          foo: 'f01',
          bar: 'b01'
        }
      }
    },
  'scene is added to items list when sceneCreate is dispatched')
  t.equal(state.scenes.currentSceneId, 'id_2',
    'scene just created is made current'
  )

  t.deepEqual(state.scenes.channels, {
    A: 'id_1',
    B: false
  },
    'because is NOT first scene, channels remain untouched'
  )

  t.deepEqual(state.ui.isEditing,
    {
      id: 'id_2',
      type: 'sceneTitle'
    }
  , 'UI opens to editing scene')

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
      currentSceneId: 'id_1',
      channels: {
        A: 'id_1',
        B: 'id_2'
      },
      items: {
        id_1: {
          id: 'id_1',
          sketchIds: [],
          linkableActionIds: {}
        },
        id_2: {
          id: 'id_2',
          sketchIds: ['sketch_01', 'sketch_02'],
          linkableActionIds: {
            foo: 'f01',
            bar: 'b01'
          }
        }
      }
    },
    linkableActions: {
      f01: {
        id: 'f01',
        inputLinkIds: []
      },
      b01: {
        id: 'b01',
        inputLinkIds: ['i01']
      }
    }
  }, applyMiddleware(sagaMiddleware, listen(rootListener)))
  sagaMiddleware.run(rootSaga, store.dispatch)

  let state

  store.dispatch(uSceneDelete('id_1'))
  state = store.getState()
  t.deepEqual(state.scenes.items,
    {
      id_2: {
        id: 'id_2',
        sketchIds: ['sketch_01', 'sketch_02'],
        linkableActionIds: {
          foo: 'f01',
          bar: 'b01'
        }
      }
    },
  'Scene deleted with no sketches just removes that scene')
  t.equal(state.scenes.currentSceneId, 'id_2',
    'currentSceneId is changed to last item in list'
  )

  t.deepEqual(state.scenes.channels, {
    A: false,
    B: 'id_2'
  },
    'Scene id is removed from channel'
  )

  t.equal(Object.keys(state.nodes).length, 3, 'Nodes kept the same')
  t.equal(Object.keys(state.sketches).length, 2, 'Sketches kept the same')
  t.equal(Object.keys(state.linkableActions).length, 2, 'linkableActions kept the same')

  store.dispatch(uSceneDelete('id_2'))
  state = store.getState()

  t.equal(Object.keys(state.scenes.items).length, 0, 'Last scene deleted, scenes are now 0')
  t.equal(state.scenes.currentSceneId, false, 'Last scene deleted, currentSceneId is now false')
  t.equal(Object.keys(state.nodes).length, 0, 'Last scene deleted, nodes are now 0')
  t.equal(Object.keys(state.sketches).length, 0, 'Last scene deleted, sketches are now 0')
  t.equal(Object.keys(state.linkableActions).length, 0, 'Last scene deleted, linkableActions are now 0')
  t.deepEqual(state.scenes.channels, {
    A: false,
    B: false
  },
    'Scene id is removed from channel'
  )

  t.end()
})

test('(mock) Scenes - Select Sketch', (t) => {
  const store = createStore(rootReducer, {
    nodes: {
    },
    sketches: {
    },
    scenes: {
      items: {
        id_1: {
          id: 'id_1',
          selectedSketchId: false,
          sketchIds: ['sketch_03']
        },
        id_2: {
          id: 'id_2',
          selectedSketchId: 'sketch_01',
          sketchIds: ['sketch_01', 'sketch_02']
        }
      }
    }
  }, applyMiddleware(sagaMiddleware, listen(rootListener)))
  sagaMiddleware.run(rootSaga, store.dispatch)

  let state

  store.dispatch(sceneSketchSelect('id_1', 'sketch_03'))
  state = store.getState()
  t.deepEqual(state.scenes,
    {
      items: {
        id_1: {
          id: 'id_1',
          selectedSketchId: 'sketch_03',
          sketchIds: ['sketch_03']
        },
        id_2: {
          id: 'id_2',
          selectedSketchId: 'sketch_01',
          sketchIds: ['sketch_01', 'sketch_02']
        }
      }
    },
  'Sketch id updated when sketch selected')

  store.dispatch(sceneSketchSelect('id_2', 'sketch_01'))
  state = store.getState()
  t.deepEqual(state.scenes,
    {
      items: {
        id_1: {
          id: 'id_1',
          selectedSketchId: 'sketch_03',
          sketchIds: ['sketch_03']
        },
        id_2: {
          id: 'id_2',
          selectedSketchId: 'sketch_01',
          sketchIds: ['sketch_01', 'sketch_02']
        }
      }
    },
  'Sketch id updated when sketch selected')

  t.end()
})

test('(mock) Scenes - Rename', (t) => {
  const store = createStore(rootReducer, {
    nodes: {
    },
    sketches: {
    },
    scenes: {
      items: {
        id_1: {
          title: 'Foo Title',
          id: 'id_1'
        },
        id_2: {
          title: 'Bar Title',
          id: 'id_2'
        }
      }
    }
  }, applyMiddleware(sagaMiddleware, listen(rootListener)))
  sagaMiddleware.run(rootSaga, store.dispatch)

  let state

  store.dispatch(sceneRename('id_1', 'Lorem Ipsum'))
  state = store.getState()
  t.deepEqual(state.scenes,
    {
      items: {
        id_1: {
          title: 'Lorem Ipsum',
          id: 'id_1'
        },
        id_2: {
          title: 'Bar Title',
          id: 'id_2'
        }
      }
    },
  'Scene title updated')

  store.dispatch(sceneRename('id_2', 'Ipsum Dollor'))
  state = store.getState()
  t.deepEqual(state.scenes,
    {
      items: {
        id_1: {
          title: 'Lorem Ipsum',
          id: 'id_1'
        },
        id_2: {
          title: 'Ipsum Dollor',
          id: 'id_2'
        }
      }
    },
  'Scene title updated')

  t.end()
})
