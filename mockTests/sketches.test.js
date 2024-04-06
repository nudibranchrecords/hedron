import listen from 'redux-action-listeners'
import { createStore, applyMiddleware, combineReducers } from 'redux'

import { uSketchCreate, uSketchDelete } from '../src/store/sketches/actions'

import sketchesReducer from '../src/store/sketches/reducer'
import availableModulesReducer from '../src/store/availableModules/reducer'
import nodesReducer from '../src/store/nodes/reducer'
import scenesReducer from '../src/store/scenes/reducer'
import macrosReducer from '../src/store/macros/reducer'

import sketchesListener from '../src/store/sketches/listener'
import scenesListener from '../src/store/scenes/listener'
import nodesListener from '../src/store/nodes/listener'
import macrosListener from '../src/store/macros/listener'

import renderer from '../src/engine/renderer'

let mockUniqueId = 0

jest.mock('uid', () => () => {
  mockUniqueId++
  return 'id_' + mockUniqueId
})

jest.mock('../src/engine/renderer', () => ({
  setPostProcessing: jest.fn(),
}))
jest.mock('../src/valueTypes/FloatValueType/container', () => null)
jest.mock('../src/valueTypes/BooleanValueType/container', () => null)
jest.mock('../src/valueTypes/EnumValueType/container', () => null)

const rootListener = {
  types: 'all',

  handleAction (action, dispatched, store) {
    sketchesListener(action, store)
    scenesListener(action, store)
    nodesListener(action, store)
    macrosListener(action, store)
  },
}

test('(mock) Sketches - Add/Delete Sketch', () => {
  let ppCalled = 0

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
      sceneIds: ['scene_01', 'scene_02'],
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
  }, applyMiddleware(listen(rootListener)))

  let state

  state = store.getState()

  // 'nodes start empty'
  expect(state.nodes).toEqual({})

  store.dispatch(uSketchCreate('foo', 'scene_01'))
  state = store.getState()

  ppCalled++
  // After creating sketch, postprocessing is reset
  expect(renderer.setPostProcessing).toHaveBeenCalledTimes(ppCalled)

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
      valueType: 'float',
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

  ppCalled++
  // After creating sketch, postprocessing is reset
  expect(renderer.setPostProcessing).toHaveBeenCalledTimes(ppCalled)

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
      valueType: 'float',
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
      valueType: 'float',
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
      valueType: 'float',
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
      valueType: 'shotFloat',
      method: 'explode',
      sketchId: 'id_3',
    },
  })

  state = store.getState()

  store.dispatch(uSketchDelete('id_1', 'scene_01'))
  state = store.getState()

  ppCalled++
  // After sketch deleted, postprocessing is reset
  expect(renderer.setPostProcessing).toHaveBeenCalledTimes(ppCalled)

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
      valueType: 'float',
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
      valueType: 'float',
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
      valueType: 'shotFloat',
      method: 'explode',
      sketchId: 'id_3',
    },
  })

  store.dispatch(uSketchDelete('id_3', 'scene_01'))
  state = store.getState()

  ppCalled++
  // After sketch deleted, postprocessing is reset
  expect(renderer.setPostProcessing).toHaveBeenCalledTimes(ppCalled)

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

  ppCalled++
  // After sketch added, postprocessing is reset
  expect(renderer.setPostProcessing).toHaveBeenCalledTimes(ppCalled)

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

  ppCalled++
  // After sketch deleted, postprocessing is reset
  expect(renderer.setPostProcessing).toHaveBeenCalledTimes(ppCalled)

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
  }, applyMiddleware(listen(rootListener)))

  store.dispatch(uSketchDelete('sketch_a', 'scene_01'))

  let state = store.getState()

  const nodes = state.nodes
  const macros = state.macros

  expect(nodes.param_a).toBe(undefined)
  expect(nodes.macro_link_a).toBe(undefined)
  expect(nodes.macro_a.targetParamLinks.param_a).toBe(undefined)
  expect(macros.nodeIds).toHaveLength(1) // Macro not deleted
})
