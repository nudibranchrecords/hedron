import test from 'tape'
import { getNewestSketchId, getAllSketches } from '../selectors'
import deepFreeze from 'deep-freeze'

test('(Selector) project - getNewestSketchId', (t) => {
  const state = {
    sketches: {
      instances: {
        foo: 'bar',
        lorem: 'ipsum',
        newest: 'new'
      }
    }
  }
  deepFreeze(state)

  const actual = getNewestSketchId(state)

  t.deepEqual(actual, 'newest', 'Returns newest instance id')
  t.end()
})

test('(Selector) project - getAllSketches', (t) => {
  const instances = {
    foo: 'bar',
    lorem: 'ipsum',
    newest: 'new'
  }

  const state = {
    sketches: {
      instances
    }
  }
  deepFreeze(state)

  const actual = getAllSketches(state)

  t.deepEqual(actual, instances, 'Returns all sketches')
  t.end()
})
