import test from 'tape'
import * as a from '../actions'

test('(Action Creator) paramCreate', (t) => {
  let actual = a.paramCreate('XXX', {
    title: 'Foo',
    id: 'XXX',
    value: 0.5
  })
  let expected = {
    type: 'PARAM_CREATE',
    payload: {
      id: 'XXX',
      param: {
        title: 'Foo',
        id: 'XXX',
        value: 0.5
      }
    }
  }
  t.deepEqual(actual, expected, 'Creates action to create param')
  t.end()
})

test('(Action Creator) paramDelete', (t) => {
  let actual = a.paramDelete('XXX')
  let expected = {
    type: 'PARAM_DELETE',
    payload: {
      id: 'XXX'
    }
  }
  t.deepEqual(actual, expected, 'Creates action to delete param')
  t.end()
})

test('(Action Creator) paramValueUpdate', (t) => {
  let actual = a.paramValueUpdate('XXX', 0.1)
  let expected = {
    type: 'PARAM_VALUE_UPDATE',
    payload: {
      id: 'XXX',
      value: 0.1
    }
  }
  t.deepEqual(actual, expected, 'Creates action to update param value')
  t.end()
})

test('(Action Creator) paramsReplaceAll', (t) => {
  const params = ['foo', 'bar']
  let actual = a.paramsReplaceAll(params)
  let expected = {
    type: 'PARAMS_REPLACE_ALL',
    payload: {
      params
    }
  }
  t.deepEqual(actual, expected, 'Creates action to replace all params')
  t.end()
})
