import listen from 'redux-action-listeners'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import createSagaMiddleware from 'redux-saga'
const sagaMiddleware = createSagaMiddleware()
import { uSketchCreate, uSketchDelete } from '../src/store/sketches/actions'

import { fork } from 'redux-saga/effects'
import { watchNodes } from '../src/store/nodes/sagas'
import { watchMacros } from '../src/store/macros/sagas'
import sketchesReducer from '../src/store/sketches/reducer'
import availableModulesReducer from '../src/store/availableModules/reducer'
import nodesReducer from '../src/store/nodes/reducer'
import scenesReducer from '../src/store/scenes/reducer'
import macrosReducer from '../src/store/macros/reducer'

import sketchesListener from '../src/store/sketches/listener'
import scenesListener from '../src/store/scenes/listener'

let mockUniqueId = 0

jest.mock('uid', () => () => {
  mockUniqueId++
  return 'id_' + mockUniqueId
})

const rootListener = {
  types: 'all',

  handleAction (action, dispatched, store) {
    sketchesListener(action, store)
    scenesListener(action, store)
  },
}

function* rootSaga (dispatch) {
  yield [
    fork(watchNodes),
    fork(watchMacros),
  ]
}

test('(mock) Sketches - Add/Delete Sketch', () => {
  const rootReducer = combineReducers(
    {
      nodes: nodesReducer,
      availableModules: availableModulesReducer,
      sketches: sketchesReducer,
      scenes: scenesReducer,
      router: () => ({
        location: {
          pathname: 'scenes/addSketch/scene_02',
        },
      }),
    }
  )

  const store = createStore(rootReducer, {
    availableModules: {
      foo: {
        defaultTitle: 'Foo',
        params: [
          {
            key: 'speed',
            title: 'Speed',
            defaultValue: 0.5,
            defaultMin: -1,
            defaultMax: 1,
          },
        ],
        shots: [],
      },
      bar: {
        defaultTitle: 'Bar',
        params: [
          {
            key: 'scale',
            title: 'Scale',
            defaultValue: 0.2,
          },
          {
            key: 'color',
            title: 'Color',
            defaultValue: 0.1,
          },
        ],
        shots: [
          {
            method: 'explode',
            title: 'Explode',
          },
        ],
      },
      boring: {
        defaultTitle: 'Boring',
      },
    },
    nodes: {},
    sketches: {},
    scenes: {
      currentSceneId: 'scene_02',
      items: {
        scene_01: {
          id: 'scene_01',
          selectedSketchId: false,
          sketchIds: [],
        },
        scene_02: {
          id: 'scene_02',
          selectedSketchId: false,
          sketchIds: [],
        },
      },
    },
  }, applyMiddleware(sagaMiddleware, listen(rootListener)))
  sagaMiddleware.run(rootSaga, store.dispatch)

  let state

  state = store.getState()

  // 'nodes start empty'
  expect(state.nodes).toEqual({})

  store.dispatch(uSketchCreate('foo', 'scene_01'))
  state = store.getState()

  // 'After creating sketch, sketch id is added to scene, selectedSketchId is set'
  expect(state.scenes.items).toEqual({
    scene_01: {
      id: 'scene_01',
      selectedSketchId: 'id_1',
      sketchIds: ['id_1'],
    },
    scene_02: {
      id: 'scene_02',
      selectedSketchId: false,
      sketchIds: [],
    },
  })

  //  'After creating sketch, sketch item is created'
  expect(state.sketches).toEqual({
    id_1: {
      title: 'Foo',
      moduleId: 'foo',
      paramIds: ['id_2'],
      shotIds: [],
    },
  })

  // 'After creating sketch, node item is created for param'
  expect(state.nodes).toEqual({
    id_2: {
      id: 'id_2',
      title: 'Speed',
      value: 0.5,
      inputLinkIds: [],
      shotCount: 0,
      sketchId: 'id_1',
      connectedMacroIds: [],
      type: 'param',
      key: 'speed',
      hidden: false,
      min: -1,
      max: 1,
      defaultMin: -1,
      defaultMax: 1,
    },
  })

  store.dispatch(uSketchCreate('bar', 'scene_01'))
  state = store.getState()

  //  'After creating sketch, sketch id is added to scene'
  expect(state.scenes.items).toEqual({
    scene_01: {
      id: 'scene_01',
      sketchIds: ['id_1', 'id_3'],
      selectedSketchId: 'id_3',
    },
    scene_02: {
      id: 'scene_02',
      selectedSketchId: false,
      sketchIds: [],
    },
  })

  //  'After creating sketch, sketch item is created'
  expect(state.sketches).toEqual({
    id_1: {
      title: 'Foo',
      moduleId: 'foo',
      paramIds: ['id_2'],
      shotIds: [],
    },
    id_3: {
      title: 'Bar',
      moduleId: 'bar',
      paramIds: ['id_4', 'id_5'],
      shotIds: ['id_6'],
    },
  })

  // 'After creating sketch, node items are created for params and shot'
  expect(state.nodes).toEqual({
    id_2: {
      id: 'id_2',
      title: 'Speed',
      value: 0.5,
      inputLinkIds: [],
      shotCount: 0,
      sketchId: 'id_1',
      connectedMacroIds: [],
      type: 'param',
      key: 'speed',
      hidden: false,
      min: -1,
      max: 1,
      defaultMin: -1,
      defaultMax: 1,
    },
    id_4: {
      id: 'id_4',
      title: 'Scale',
      value: 0.2,
      inputLinkIds: [],
      shotCount: 0,
      sketchId: 'id_3',
      connectedMacroIds: [],
      type: 'param',
      key: 'scale',
      hidden: false,
      min: 0,
      max: 1,
      defaultMin: 0,
      defaultMax: 1,
    },
    id_5: {
      id: 'id_5',
      title: 'Color',
      value: 0.1,
      inputLinkIds: [],
      shotCount: 0,
      sketchId: 'id_3',
      connectedMacroIds: [],
      type: 'param',
      key: 'color',
      hidden: false,
      min: 0,
      max: 1,
      defaultMin: 0,
      defaultMax: 1,
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
      sketchId: 'id_3',
    },
  })

  store.dispatch(uSketchDelete('id_1', 'scene_01'))
  state = store.getState()

  // 'After deleting sketch, sketch id is removed from scene, selectedSketchId becomes last in list'
  expect(state.scenes.items).toEqual({
    scene_01: {
      id: 'scene_01',
      sketchIds: ['id_3'],
      selectedSketchId: 'id_3',
    },
    scene_02: {
      id: 'scene_02',
      sketchIds: [],
      selectedSketchId: false,
    },
  })

  // 'After deleting sketch, sketch item is removed'
  expect(state.sketches).toEqual({
    id_3: {
      title: 'Bar',
      moduleId: 'bar',
      paramIds: ['id_4', 'id_5'],
      shotIds: ['id_6'],
    },
  })

  // 'After deleting sketch, node items are removed'
  expect(state.nodes).toEqual({
    id_4: {
      id: 'id_4',
      title: 'Scale',
      value: 0.2,
      inputLinkIds: [],
      shotCount: 0,
      sketchId: 'id_3',
      connectedMacroIds: [],
      type: 'param',
      key: 'scale',
      hidden: false,
      min: 0,
      max: 1,
      defaultMin: 0,
      defaultMax: 1,
    },
    id_5: {
      id: 'id_5',
      title: 'Color',
      value: 0.1,
      inputLinkIds: [],
      shotCount: 0,
      sketchId: 'id_3',
      connectedMacroIds: [],
      type: 'param',
      key: 'color',
      hidden: false,
      min: 0,
      max: 1,
      defaultMin: 0,
      defaultMax: 1,
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
      sketchId: 'id_3',
    },
  })

  store.dispatch(uSketchDelete('id_3', 'scene_01'))
  state = store.getState()

  expect(state.scenes.items).toEqual({
    scene_01: {
      id: 'scene_01',
      sketchIds: [],
      selectedSketchId: false,
    },
    scene_02: {
      id: 'scene_02',
      sketchIds: [],
      selectedSketchId: false,
    },
  }, 'After deleting sketch, sketch id is removed from scene, selected sketchId becomes false (none left)')

  // 'After deleting sketch, sketch item is removed'
  expect(state.sketches).toEqual({})
  // 'After deleting sketch, node items are removed'
  expect(state.nodes).toEqual({})

  store.dispatch(uSketchCreate('boring'))
  state = store.getState()

  // 'After creating sketch with no specified scene id, sketch id is added to scene using currentSceneId'
  expect(state.scenes.items).toEqual({
    scene_01: {
      id: 'scene_01',
      sketchIds: [],
      selectedSketchId: false,
    },
    scene_02: {
      id: 'scene_02',
      sketchIds: ['id_7'],
      selectedSketchId: 'id_7',
    },
  })

  // 'After creating sketch, sketch item is created'
  expect(state.sketches).toEqual({
    id_7: {
      title: 'Boring',
      moduleId: 'boring',
      paramIds: [],
      shotIds: [],
    },
  })

  // 'After creating sketch, no nodes created (because sketch has no params/shots)'
  expect(state.nodes).toEqual({})

  store.dispatch(uSketchDelete('id_7'))
  state = store.getState()

  // 'After deleting sketch with no specified scene id, uses currentSceneId to determine which scene'
  expect(state.scenes.items).toEqual({
    scene_01: {
      id: 'scene_01',
      sketchIds: [],
      selectedSketchId: false,
    },
    scene_02: {
      id: 'scene_02',
      sketchIds: [],
      selectedSketchId: false,
    },
  })

  // 'After deleting sketch, sketch item is removed'
  expect(state.sketches).toEqual({})
})

test('(mock) Sketches - Delete sketch with macro associated to params', () => {
  const rootReducer = combineReducers(
    {
      nodes: nodesReducer,
      availableModules: availableModulesReducer,
      sketches: sketchesReducer,
      scenes: scenesReducer,
      macros: macrosReducer,
      router: () => ({
        location: {
          pathname: 'scenes/addSketch/scene_02',
        },
      }),
    }
  )

  const store = createStore(rootReducer, {
    nodes: {
      param_a: {
        id: 'param_a',
        connectedMacroIds: ['macro_a'],
      },
      macro_a: {
        targetParamLinks: {
          param_a: {
            paramId: 'param_a',
            nodeId: 'macro_link_a',
          },
        },
      },
      macro_link_a: {

      },
    },
    sketches: {
      sketch_a: {
        paramIds: ['param_a'],
        shotIds: [],
      },
    },
    scenes: {
      currentSceneId: 'scene_01',
      items: {
        scene_01: {
          id: 'scene_01',
          selectedSketchId: false,
          sketchIds: ['sketch_a'],
        },
      },
    },
    macros: {
      nodeIds: ['macro_a'],
    },
  }, applyMiddleware(sagaMiddleware, listen(rootListener)))
  sagaMiddleware.run(rootSaga, store.dispatch)

  store.dispatch(uSketchDelete('sketch_a', 'scene_01'))

  let state = store.getState()

  const nodes = state.nodes
  const macros = state.macros

  expect(nodes.param_a).toBe(undefined)
  expect(nodes.macro_link_a).toBe(undefined)
  expect(nodes.macro_a.targetParamLinks.param_a).toBe(undefined)
  expect(macros.nodeIds).toHaveLength(1) // Macro not deleted
})

// TODO: Below tests disabled because since changes made to reimporting sketches, this is now harder to mock

// test('(mock) Sketches - Reimport Sketch (Unedited sketch)', (t) => {
//   mockUniqueId = 2

//   const defaultState = {
//     nodes: {
//       id_2: {
//         id: 'id_2',
//         title: 'Speed',
//         value: 0.5,
//         inputLinkIds: [],
//         shotCount: 0,
//         connectedMacroIds: [],
//         type: 'param',
//         key: 'speed',
//         hidden: false,
//         min: 0,
//         max: 1,
//         defaultMin: 0,
//         defaultMax: 1,
//       },
//     },
//     availableModules: {
//       foo: {
//         defaultTitle: 'Foo',
//         filePathArray: [],
//         params: [
//           {
//             key: 'speed',
//             title: 'Speed',
//             defaultValue: 0.5,
//           },
//         ],
//         shots: [],
//       },
//     },
//     sketches: {
//       id_1: {
//         title: 'Foo',
//         moduleId: 'foo',
//         paramIds: ['id_2'],
//         shotIds: [],
//       },
//     },
//     scenes: {
//       items: {},
//     },
//     project: {
//       sketchesPath: '',
//     },
//   }

//   const store = createStore(rootReducer, defaultState,
//     applyMiddleware(sagaMiddleware, listen(rootListener)))
//   sagaMiddleware.run(rootSaga, store.dispatch)

//   let state

//   store.dispatch(uSketchReloadFile('id_1'))

//   state = store.getState()

//   // 'After reimporting undedited sketch, state has not changed'
//   expect(state).toEqual(defaultState)
// })

// test('(mock) Sketches - Reimport Sketch (simple)', (t) => {
//   mockUniqueId = 2

//   const store = createStore(rootReducer, {
//     availableModules: {
//       foo: {
//         defaultTitle: 'Foo',
//         params: [
//           {
//             key: 'speed',
//             title: 'Speed',
//             defaultValue: 0.5,
//           },
//           {
//             key: 'scale',
//             title: 'Scale',
//             defaultValue: 0.2,
//           },
//         ],
//         shots: [],
//       },
//     },
//     nodes: {
//       id_2: {
//         id: 'id_2',
//         title: 'Speed',
//         value: 0.5,
//         inputLinkIds: [],
//         shotCount: 0,
//         connectedMacroIds: [],
//         type: 'param',
//         key: 'speed',
//         hidden: false,
//         min: 0,
//         max: 1,
//       },
//     },
//     sketches: {
//       id_1: {
//         title: 'Foo',
//         moduleId: 'foo',
//         paramIds: ['id_2'],
//         shotIds: [],
//       },
//     },
//   }, applyMiddleware(sagaMiddleware, listen(rootListener)))
//   sagaMiddleware.run(rootSaga, store.dispatch)

//   let state

//   store.dispatch(uSketchReloadFile('id_1'))

//   state = store.getState()

//   // 'After reimporting, sketch has new paramId'
//   expect(state.sketches['id_1'].paramIds).toEqual(['id_2', 'id_3'])

//   // 'After reimporting, new node exists'
//   expect(state.nodes).toEqual(
//     {
//       id_2: {
//         id: 'id_2',
//         title: 'Speed',
//         value: 0.5,
//         inputLinkIds: [],
//         shotCount: 0,
//         connectedMacroIds: [],
//         type: 'param',
//         key: 'speed',
//         hidden: false,
//         min: 0,
//         max: 1,
//         defaultMin: 0,
//         defaultMax: 1,
//       },
//       id_3: {
//         id: 'id_3',
//         title: 'Scale',
//         value: 0.2,
//         inputLinkIds: [],
//         shotCount: 0,
//         connectedMacroIds: [],
//         type: 'param',
//         key: 'scale',
//         hidden: false,
//         min: 0,
//         max: 1,
//         defaultMin: 0,
//         defaultMax: 1,
//       },
//     },
//   )
// })

// test('(mock) Sketches - Reimport Sketch (params and shots)', (t) => {
//   mockUniqueId = 2

//   const store = createStore(rootReducer, {
//     availableModules: {
//       foo: {
//         defaultTitle: 'Foo',
//         params: [
//           {
//             key: 'speed',
//             title: 'Speed',
//             defaultValue: 0.5,
//           },
//           {
//             key: 'scale',
//             title: 'Scale',
//             defaultValue: 0.2,
//           },
//         ],
//         shots: [
//           {
//             method: 'explode',
//             title: 'Explode',
//           },
//           {
//             method: 'spin',
//             title: 'Spin',
//           },
//         ],
//       },
//     },
//     nodes: {
//       id_2: {
//         id: 'id_2',
//         title: 'Speed',
//         value: 0.5,
//         inputLinkIds: [],
//         shotCount: 0,
//         connectedMacroIds: [],
//         type: 'param',
//         key: 'speed',
//         hidden: false,
//         min: 0,
//         max: 1,
//       },
//       id_3: {
//         id: 'id_3',
//         title: 'Explode',
//         value: 0,
//         inputLinkIds: [],
//         shotCount: 0,
//         connectedMacroIds: [],
//         type: 'shot',
//         method: 'explode',
//         sketchId: 'id_1',
//       },
//     },
//     sketches: {
//       id_1: {
//         title: 'Foo',
//         moduleId: 'foo',
//         paramIds: ['id_2'],
//         shotIds: ['id_3'],
//       },
//     },
//   }, applyMiddleware(sagaMiddleware, listen(rootListener)))
//   sagaMiddleware.run(rootSaga, store.dispatch)

//   let state

//   store.dispatch(uSketchReloadFile('id_1'))

//   state = store.getState()

//   // 'After reimporting, sketch has new paramId'
//   expect(state.sketches['id_1'].paramIds).toEqual(['id_2', 'id_4'])

//   // 'After reimporting, sketch has new shotId'
//   expect(state.sketches['id_1'].shotIds).toEqual(['id_3', 'id_5'])

//   // 'After reimporting, new nodes exist'
//   expect(state.nodes).toEqual(
//     {
//       id_2: {
//         id: 'id_2',
//         title: 'Speed',
//         value: 0.5,
//         inputLinkIds: [],
//         shotCount: 0,
//         connectedMacroIds: [],
//         type: 'param',
//         key: 'speed',
//         hidden: false,
//         min: 0,
//         max: 1,
//         defaultMin: 0,
//         defaultMax: 1,
//       },
//       id_3: {
//         id: 'id_3',
//         title: 'Explode',
//         value: 0,
//         inputLinkIds: [],
//         shotCount: 0,
//         connectedMacroIds: [],
//         type: 'shot',
//         method: 'explode',
//         sketchId: 'id_1',
//       },
//       id_4: {
//         id: 'id_4',
//         title: 'Scale',
//         value: 0.2,
//         inputLinkIds: [],
//         shotCount: 0,
//         connectedMacroIds: [],
//         type: 'param',
//         key: 'scale',
//         hidden: false,
//         min: 0,
//         max: 1,
//         defaultMin: 0,
//         defaultMax: 1,
//       },
//       id_5: {
//         id: 'id_5',
//         title: 'Spin',
//         value: 0,
//         inputLinkIds: [],
//         shotCount: 0,
//         connectedMacroIds: [],
//         type: 'shot',
//         method: 'spin',
//         sketchId: 'id_1',
//       },
//     }
//   )
// })

// test('(mock) Sketches - Reimport Sketch (with shot and param title changes)', (t) => {
//   mockUniqueId = 2

//   const store = createStore(rootReducer, {
//     availableModules: {
//       foo: {
//         defaultTitle: 'Foo',
//         params: [
//           {
//             key: 'speed',
//             title: 'Speed New',
//             defaultValue: 0.5,
//           },
//           {
//             key: 'scale',
//             title: 'Scale',
//             defaultValue: 0.2,
//           },
//         ],
//         shots: [
//           {
//             method: 'explode',
//             title: 'Explode New',
//           },
//         ],
//       },
//     },
//     nodes: {
//       id_2: {
//         id: 'id_2',
//         title: 'Speed',
//         value: 0.5,
//         inputLinkIds: [],
//         shotCount: 0,
//         connectedMacroIds: [],
//         hidden: false,
//         min: 0,
//         max: 1,
//         type: 'param',
//         key: 'speed',
//       },
//       id_3: {
//         id: 'id_3',
//         title: 'Explode New',
//         value: 0,
//         inputLinkIds: [],
//         shotCount: 0,
//         connectedMacroIds: [],
//         type: 'shot',
//         method: 'explode',
//         sketchId: 'id_1',
//       },
//     },
//     sketches: {
//       id_1: {
//         title: 'Foo',
//         moduleId: 'foo',
//         paramIds: ['id_2'],
//         shotIds: ['id_3'],
//       },
//     },
//   }, applyMiddleware(sagaMiddleware, listen(rootListener)))
//   sagaMiddleware.run(rootSaga, store.dispatch)

//   let state

//   store.dispatch(uSketchReloadFile('id_1'))

//   state = store.getState()

//   // 'After reimporting, sketch has new paramId'
//   expect(state.sketches['id_1'].paramIds).toEqual(['id_2', 'id_4'])

//   // 'After reimporting, new node exists, old nodes titles have changed'
//   expect(state.nodes).toEqual(
//     {
//       id_2: {
//         id: 'id_2',
//         title: 'Speed New',
//         value: 0.5,
//         inputLinkIds: [],
//         shotCount: 0,
//         connectedMacroIds: [],
//         type: 'param',
//         key: 'speed',
//         hidden: false,
//         min: 0,
//         max: 1,
//         defaultMin: 0,
//         defaultMax: 1,
//       },
//       id_3: {
//         id: 'id_3',
//         title: 'Explode New',
//         value: 0,
//         inputLinkIds: [],
//         shotCount: 0,
//         connectedMacroIds: [],
//         type: 'shot',
//         method: 'explode',
//         sketchId: 'id_1',
//       },
//       id_4: {
//         id: 'id_4',
//         title: 'Scale',
//         value: 0.2,
//         inputLinkIds: [],
//         shotCount: 0,
//         connectedMacroIds: [],
//         type: 'param',
//         key: 'scale',
//         hidden: false,
//         min: 0,
//         max: 1,
//         defaultMin: 0,
//         defaultMax: 1,
//       },
//     }
//   )
// })

// test('(mock) Sketches - Reimport Sketch (Different order)', (t) => {
//   mockUniqueId = 2

//   const store = createStore(rootReducer, {
//     availableModules: {
//       foo: {
//         defaultTitle: 'Foo',
//         params: [
//           {
//             key: 'speed',
//             title: 'Speed',
//             defaultValue: 0.5,
//           },
//           {
//             key: 'bar',
//             title: 'Bar',
//             defaultValue: 0.5,
//           },
//           {
//             key: 'scale',
//             title: 'Scale',
//             defaultValue: 0.2,
//           },
//         ],
//         shots: [],
//       },
//     },
//     nodes: {
//       id_2: {
//         id: 'id_2',
//         title: 'Speed',
//         value: 0.5,
//         inputLinkIds: [],
//         shotCount: 0,
//         connectedMacroIds: [],
//         type: 'param',
//         key: 'speed',
//         hidden: false,
//         min: 0,
//         max: 1,
//       },
//       id_3: {
//         id: 'id_3',
//         title: 'Scale',
//         value: 0.2,
//         inputLinkIds: [],
//         shotCount: 0,
//         connectedMacroIds: [],
//         type: 'param',
//         key: 'scale',
//         hidden: false,
//         min: 0,
//         max: 1,
//       },
//     },
//     sketches: {
//       id_1: {
//         title: 'Foo',
//         moduleId: 'foo',
//         paramIds: ['id_2', 'id_3'],
//         shotIds: [],
//       },
//     },
//   }, applyMiddleware(sagaMiddleware, listen(rootListener)))
//   sagaMiddleware.run(rootSaga, store.dispatch)

//   let state

//   store.dispatch(uSketchReloadFile('id_1'))

//   state = store.getState()

//   // 'After reimporting, sketch has new paramId in middle of array'
//   expect(state.sketches['id_1'].paramIds).toEqual(['id_2', 'id_4', 'id_3'])

//   // 'After reimporting, new node exists'
//   expect(state.nodes).toEqual(
//     {
//       id_2: {
//         id: 'id_2',
//         title: 'Speed',
//         value: 0.5,
//         inputLinkIds: [],
//         shotCount: 0,
//         connectedMacroIds: [],
//         type: 'param',
//         key: 'speed',
//         hidden: false,
//         min: 0,
//         max: 1,
//         defaultMin: 0,
//         defaultMax: 1,
//       },
//       id_3: {
//         id: 'id_3',
//         title: 'Scale',
//         value: 0.2,
//         inputLinkIds: [],
//         shotCount: 0,
//         connectedMacroIds: [],
//         type: 'param',
//         key: 'scale',
//         hidden: false,
//         min: 0,
//         max: 1,
//         defaultMin: 0,
//         defaultMax: 1,
//       },
//       id_4: {
//         id: 'id_4',
//         title: 'Bar',
//         value: 0.5,
//         inputLinkIds: [],
//         shotCount: 0,
//         connectedMacroIds: [],
//         type: 'param',
//         key: 'bar',
//         hidden: false,
//         min: 0,
//         max: 1,
//         defaultMin: 0,
//         defaultMax: 1,
//       },
//     }
//   )
// })

// test('(mock) Sketches - Reimport Sketch (remove old nodes)', (t) => {
//   mockUniqueId = 2

//   const store = createStore(rootReducer, {
//     availableModules: {
//       foo: {
//         defaultTitle: 'Foo',
//         params: [
//           {
//             key: 'speed',
//             title: 'Speed',
//             defaultValue: 0.5,
//           },
//         ],
//         shots: [
//           {
//             method: 'spin',
//             title: 'Spin',
//           },
//         ],
//       },
//     },
//     nodes: {
//       id_2: {
//         id: 'id_2',
//         title: 'Speed',
//         value: 0.5,
//         inputLinkIds: [],
//         shotCount: 0,
//         connectedMacroIds: [],
//         type: 'param',
//         key: 'speed',
//         hidden: false,
//         min: 0,
//         max: 1,
//         defaultMin: 0,
//         defaultMax: 1,
//       },
//       id_3: {
//         id: 'id_3',
//         title: 'Explode',
//         value: 0,
//         inputLinkIds: [],
//         shotCount: 0,
//         connectedMacroIds: [],
//         type: 'shot',
//         method: 'explode',
//         sketchId: 'id_1',
//       },
//       id_4: {
//         id: 'id_4',
//         title: 'Scale',
//         value: 0.2,
//         inputLinkIds: [],
//         shotCount: 0,
//         connectedMacroIds: [],
//         type: 'param',
//         key: 'scale',
//         hidden: false,
//         min: 0,
//         max: 1,
//         defaultMin: 0,
//         defaultMax: 1,
//       },
//       id_5: {
//         id: 'id_5',
//         title: 'Spin',
//         value: 0,
//         inputLinkIds: [],
//         shotCount: 0,
//         connectedMacroIds: [],
//         type: 'shot',
//         method: 'spin',
//         sketchId: 'id_1',
//       },
//     },
//     sketches: {
//       id_1: {
//         title: 'Foo',
//         moduleId: 'foo',
//         paramIds: ['id_2', 'id_4'],
//         shotIds: ['id_3', 'id_5'],
//       },
//     },
//   }, applyMiddleware(sagaMiddleware, listen(rootListener)))
//   sagaMiddleware.run(rootSaga, store.dispatch)

//   let state

//   store.dispatch(uSketchReloadFile('id_1'))

//   state = store.getState()

//   // 'After reimporting, sketch has removed paramId'
//   expect(state.sketches['id_1'].paramIds).toEqual(['id_2'])

//   // 'After reimporting, sketch has removed shotId'
//   expect(state.sketches['id_1'].shotIds).toEqual(['id_5'])

//   // 'After reimporting, old nodes removed'
//   expect(state.nodes).toEqual(
//     {
//       id_2: {
//         id: 'id_2',
//         title: 'Speed',
//         value: 0.5,
//         inputLinkIds: [],
//         shotCount: 0,
//         connectedMacroIds: [],
//         type: 'param',
//         key: 'speed',
//         hidden: false,
//         min: 0,
//         max: 1,
//         defaultMin: 0,
//         defaultMax: 1,
//       },
//       id_5: {
//         id: 'id_5',
//         title: 'Spin',
//         value: 0,
//         inputLinkIds: [],
//         shotCount: 0,
//         connectedMacroIds: [],
//         type: 'shot',
//         method: 'spin',
//         sketchId: 'id_1',
//       },
//     })
// })
