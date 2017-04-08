import test from 'tape'
import { getProjectData, getProjectFilepath } from '../selectors'
import deepFreeze from 'deep-freeze'

test('(Selector) project - getProjectData', (t) => {
  const state = {
    project: 'proj',
    sketches: {
      modules: 'foo',
      instances: 'bar',
      params: 'lorem'
    }
  }
  deepFreeze(state)

  const expected = {
    sketches: {
      instances: 'bar',
      params: 'lorem'
    },
    project: 'proj'
  }

  const actual = getProjectData(state)

  t.deepEqual(actual, expected, 'Returns project object')
  t.end()
})

test('(Selector) project - getProjectFilepath', (t) => {
  const state = {
    project: {
      filePath: 'some/path'
    }
  }
  deepFreeze(state)

  const expected = 'some/path'

  const actual = getProjectFilepath(state)

  t.equal(actual, expected, 'Returns project object')
  t.end()
})
