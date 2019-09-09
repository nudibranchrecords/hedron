import test from 'tape'
import { getProjectData, getProjectFilepath } from '../selectors'
import deepFreeze from 'deep-freeze'

test('(Selector) project - getProjectData', (t) => {
  const state = {
    project: '@@project',
    availableModules: '@@availableModules',
    midi: '@@midi',
    inputs: '@@inputs',
    sketches: '@@sketches',
    params: '@@params',
    displays: '@@displays',
    clock: '@@clock',
  }
  deepFreeze(state)

  const expected = {
    midi: '@@midi',
    project: '@@project',
    inputs: '@@inputs',
    sketches: '@@sketches',
    params: '@@params',
  }

  const actual = getProjectData(state)

  t.deepEqual(actual, expected, 'Returns project object without: availableModules, midi, displays, clock')
  t.end()
})

test('(Selector) project - getProjectFilepath', (t) => {
  const state = {
    project: {
      filePath: 'some/path',
    },
  }
  deepFreeze(state)

  const expected = 'some/path'

  const actual = getProjectFilepath(state)

  t.equal(actual, expected, 'Returns project object')
  t.end()
})
