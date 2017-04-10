import test from 'tape'
import { getNewestSketchId } from '../selectors'
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
