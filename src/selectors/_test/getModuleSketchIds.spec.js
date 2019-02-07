import test from 'tape'
import getModuleSketchIds from '../getModuleSketchIds'

test('(Selector) getModuleSketchIds', (t) => {
  let actual

  const state = {
    scenes: {
      items: {
        scene_0: {
          id: 'scene_0',
          sketchIds: ['sketch_0', 'sketch_1', 'sketch_2'],
        },
        scene_1: {
          id: 'scene_1',
          sketchIds: ['sketch_3', 'sketch_4', 'sketch_5'],
        },
      },
    },
    sketches: {
      sketch_0: {
        id: 'sketch_0',
        moduleId: 'foo_module',
      },
      sketch_1: {
        id: 'sketch_1',
        moduleId: 'bar_module',
      },
      sketch_2: {
        id: 'sketch_2',
        moduleId: 'foo_module',
      },
      sketch_3: {
        id: 'sketch_3',
        moduleId: 'foo_module',
      },
      sketch_4: {
        id: 'sketch_4',
        moduleId: 'foo_module',
      },
      sketch_5: {
        id: 'sketch_5',
        moduleId: 'bar_module',
      },
    },
  }

  const expected = [
    {
      sceneId: 'scene_0',
      sketchId: 'sketch_0',
    },
    {
      sceneId: 'scene_0',
      sketchId: 'sketch_2',
    },
    {
      sceneId: 'scene_1',
      sketchId: 'sketch_3',
    },
    {
      sceneId: 'scene_1',
      sketchId: 'sketch_4',
    },
  ]

  actual = getModuleSketchIds(state, 'foo_module')
  t.deepEqual(actual, expected, 'Returns array of objects with sceneId and sketchId for matching sketches')

  t.end()
})
