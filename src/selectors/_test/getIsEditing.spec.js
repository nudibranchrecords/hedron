import test from 'tape'
import getIsEditing from '../getIsEditing'

test('(Selector) getIsEditing - not editing', (t) => {
  let actual

  const state = {
    ui: {
      isEditing: false
    }
  }

  actual = getIsEditing(state, 'XXX')
  t.deepEqual(actual, false, 'Returns false')

  t.end()
})

test('(Selector) getIsEditing - editing type doesnt match', (t) => {
  let actual

  const state = {
    ui: {
      isEditing: {
        id: 'XXX',
        type: 'fooType'
      }
    }
  }

  actual = getIsEditing(state, 'XXX', 'barType')
  t.deepEqual(actual, false, 'Returns false when ID matches')

  actual = getIsEditing(state, 'YYY', 'barType')
  t.deepEqual(actual, false, 'Returns false when ID doesn\'t match')
  t.end()
})

test('(Selector) getIsEditing - editing type does match', (t) => {
  let actual

  const state = {
    ui: {
      isEditing: {
        id: 'XXX',
        type: 'fooType'
      }
    }
  }

  actual = getIsEditing(state, 'XXX', 'fooType')
  t.deepEqual(actual, true, 'Returns true when ID matches')

  actual = getIsEditing(state, 'YYY', 'fooType')
  t.deepEqual(actual, false, 'Returns false when ID doesn\'t match')
  t.end()
})
