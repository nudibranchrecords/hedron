import test from 'tape'
import * as a from '../actions'

test('(Action Creator) shotCreate', (t) => {
  let actual = a.shotCreate('XXX', {
    title: 'Meow',
    method: 'meow',
    id: 'XXX',
    sketchId: 'YYY'
  })

  let expected = {
    type: 'SHOT_CREATE',
    payload: {
      id: 'XXX',
      shot: {
        title: 'Meow',
        method: 'meow',
        id: 'XXX',
        sketchId: 'YYY'
      }
    }
  }
  t.deepEqual(actual, expected, 'Creates action to create shot')
  t.end()
})

test('(Action Creator) shotDelete', (t) => {
  let actual = a.shotDelete('XXX')
  let expected = {
    type: 'SHOT_DELETE',
    payload: {
      id: 'XXX'
    }
  }
  t.deepEqual(actual, expected, 'Creates action to delete shot')
  t.end()
})

test('(Action Creator) shotFired', (t) => {
  let actual = a.shotFired('XXX', 'meow')
  let expected = {
    type: 'SHOT_FIRED',
    payload: {
      sketchId: 'XXX',
      method: 'meow'
    }
  }
  t.deepEqual(actual, expected, 'Creates action to fire shot')
  t.end()
})

test('(Action Creator) shotsReplaceAll', (t) => {
  const shots = ['foo', 'bar']
  let actual = a.shotsReplaceAll(shots)
  let expected = {
    type: 'SHOTS_REPLACE_ALL',
    payload: {
      shots
    }
  }
  t.deepEqual(actual, expected, 'Creates action to replace all shots')
  t.end()
})
