import test from 'tape'
import * as a from '../actions'

test('(Action Creator) sceneSketchCreate', (t) => {
  let actual = a.sceneSketchCreate('cubey')
  let expected = {
    type: 'SCENE_SKETCH_CREATE',
    payload: {
      moduleId: 'cubey'
    }
  }
  t.deepEqual(actual, expected, 'Creates action to add a sketch to scene')
  t.end()
})

test('(Action Creator) sceneSketchDelete', (t) => {
  let actual = a.sceneSketchDelete('XXX')
  let expected = {
    type: 'SCENE_SKETCH_DELETE',
    payload: {
      id: 'XXX'
    }
  }
  t.deepEqual(actual, expected, 'Creates action to delete a sketch from scene')
  t.end()
})
