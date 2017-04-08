import test from 'tape'
import { getProject } from '../selectors'
import deepFreeze from 'deep-freeze'

test('(Selector) saveSaga - getProject', (t) => {
  const state = {
    sketches: {
      modules: 'foo',
      instances: 'bar',
      params: 'lorem'
    }
  }
  deepFreeze(state)

  const expected = {
    instances: 'bar',
    params: 'lorem'
  }

  const actual = getProject(state)

  t.deepEqual(actual, expected, 'Returns project object')
  t.end()
})
