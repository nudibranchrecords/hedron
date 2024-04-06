import { rMacroClose } from '../actions'
import uiReducer from '../reducer'

test('(Reducer) macroReducer - R_MACRO_CLOSE', () => {
  let state, actual

  state = {
    openedId: 'foo',
  }

  actual = uiReducer(state, rMacroClose())

  // Always sets to undefined when no args given
  expect(actual.openedId).toBe(undefined)

  state = {
    openedId: 'foo',
  }

  actual = uiReducer(state, rMacroClose('bar'))

  // Doesn't do anything when args dont match
  expect(actual).toEqual(state)

  actual = uiReducer(state, rMacroClose('foo'))

  // Sets to undefined when args match
  expect(actual.openedId).toBe(undefined)
})
