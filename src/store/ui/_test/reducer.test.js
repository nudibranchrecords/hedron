import { uiEditingClose } from '../actions'
import uiReducer from '../reducer'

test('(Reducer) uiReducer - UI_EDITING_CLOSE', () => {
  let state, actual

  state = {
    isEditing: {
      type: 'foo',
      id: 'bar',
    },
  }

  actual = uiReducer(state, uiEditingClose())

  // Always sets to false when no args given
  expect(actual.isEditing).toBe(false)

  state = {
    isEditing: {
      type: 'foo',
      id: 'bar',
    },
  }

  actual = uiReducer(state, uiEditingClose('not', 'correct'))

  // Doesn't do anything when args dont match
  expect(actual).toEqual(state)

  actual = uiReducer(state, uiEditingClose('foo', 'bar'))

  // Sets to false when args match
  expect(actual.isEditing).toBe(false)
})
