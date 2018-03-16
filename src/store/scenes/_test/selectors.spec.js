import test from 'tape'
import { getModule, getSketchParamIds, getSketchShotIds } from '../selectors'
import deepFreeze from 'deep-freeze'

test('(Selector) scene - getModule', (t) => {
  const state = {
    availableModules: {
      cubey: 'foo',
      swirly: 'bar'
    }
  }
  deepFreeze(state)

  const expected = 'foo'

  const actual = getModule(state, 'cubey')

  t.equal(actual, expected, 'Returns module')
  t.end()
})

test('(Selector) scene - getSketchParamIds', (t) => {
  const state = {
    sketches: {
      XXX: {
        paramIds: ['P1', 'P2', 'P3']
      },
      YYY: {
        paramIds: ['P4', 'P5', 'P6']
      }
    }
  }
  deepFreeze(state)

  const expected = ['P1', 'P2', 'P3']

  const actual = getSketchParamIds(state, 'XXX')

  t.deepEqual(actual, expected, 'Returns array of param Ids')
  t.end()
})

test('(Selector) scene - getSketchShotIds', (t) => {
  const state = {
    sketches: {
      XXX: {
        shotIds: ['P1', 'P2', 'P3']
      },
      YYY: {
        shotIds: ['P4', 'P5', 'P6']
      }
    }
  }
  deepFreeze(state)

  const expected = ['P1', 'P2', 'P3']

  const actual = getSketchShotIds(state, 'XXX')

  t.deepEqual(actual, expected, 'Returns array of shot Ids')
  t.end()
})
