import test from 'tape'
import * as a from '../actions'

test('(Action Creator) sketchCreate', (t) => {
  let actual = a.sketchCreate('XXX', { foo: 'bar' })
  let expected = {
    type: 'SKETCH_CREATE',
    payload: {
      id: 'XXX',
      sketch: { foo: 'bar' },
    },
  }
  t.deepEqual(actual, expected, 'Creates action to add a sketch')
  t.end()
})

test('(Action Creator) sketchDelete', (t) => {
  let actual = a.sketchDelete('XXX')
  let expected = {
    type: 'SKETCH_DELETE',
    payload: {
      id: 'XXX',
    },
  }
  t.deepEqual(actual, expected, 'Creates action to remove a sketch')
  t.end()
})

test('(Action Creator) sketchesReplaceAll', (t) => {
  const sketches = ['foo', 'bar']
  let actual = a.sketchesReplaceAll(sketches)
  let expected = {
    type: 'SKETCHES_REPLACE_ALL',
    payload: {
      sketches,
    },
  }
  t.deepEqual(actual, expected, 'Creates action to replace all sketches')
  t.end()
})
