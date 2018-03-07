import test from 'tape'
import { getAllSketches } from '../selectors'
import deepFreeze from 'deep-freeze'

test('(Selector) engine - getAllSketches', (t) => {
  const state = {
    sketches: {
      foo: 'bar',
      lorem: 'ipsum',
      newest: 'new'
    }
  }
  deepFreeze(state)

  const actual = getAllSketches(state)

  t.deepEqual(actual, state.sketches, 'Returns all sketches')
  t.end()
})
