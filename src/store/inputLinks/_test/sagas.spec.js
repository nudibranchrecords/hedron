import 'babel-polyfill'
import test from 'tape'
import { select, put, call } from 'redux-saga/effects'

import { getDefaultModifierIds } from '../selectors'
import { rNodeCreate } from '../../nodes/actions'
import { rInputLinkCreate } from '../actions'
import uid from 'uid'
import sinon from 'sinon'
import proxyquire from 'proxyquire'

proxyquire.noCallThru()

const getAll = sinon.stub()
const { inputLinkCreate } = proxyquire('../sagas', {
  'modifiers': { getAll }
})

test('(Saga) inputLinkCreate', (t) => {
  const linkId = 'XXX'
  const link = { foo: 'bar' }
  let modifier, uniqueId

  const generator = inputLinkCreate({
    payload: { id: linkId, link }
  })

  t.deepEqual(
    generator.next(defaults).value,
    call(getAll),
    '1. get All modifiers'
  )

  const modifiers = {
    foo: {
      config: {
        title: ['Fooey'],
        defaultValue: [0.2],
        type: 'audio'
      }
    },
    bar: {
      config: {
        title: ['Barey1', 'Barey2'],
        defaultValue: [0.5, 0.5]
      }
    }
  }

  t.deepEqual(
    generator.next(modifiers).value,
    select(getDefaultModifierIds),
    '2. get default modifier Ids'
  )

  const defaults = ['foo', 'bar']

  t.deepEqual(
    generator.next(defaults).value,
    call(uid),
    '3x. Generate unique ID for modifier'
  )

  uniqueId = 'xxx'
  modifier = {
    id: 'xxx',
    key: 'foo',
    title: 'Fooey',
    passToNext: false,
    value: 0.2,
    type: 'audio'
  }

  t.deepEqual(
    generator.next(uniqueId).value,
    put(rNodeCreate(uniqueId, modifier)),
    '4x. Create node (modifier)'
  )

  t.deepEqual(
    generator.next(defaults).value,
    call(uid),
    '3x. Generate unique ID for modifier'
  )

  uniqueId = 'yyy'
  modifier = {
    id: 'yyy',
    key: 'bar',
    title: 'Barey1',
    passToNext: true,
    value: 0.5,
    type: undefined
  }

  t.deepEqual(
    generator.next(uniqueId).value,
    put(rNodeCreate(uniqueId, modifier)),
    '4x. Create node (modifier)'
  )

  t.deepEqual(
    generator.next(defaults).value,
    call(uid),
    '3x. Generate unique ID for modifier'
  )

  uniqueId = 'yyy'
  modifier = {
    id: 'yyy',
    key: 'bar',
    title: 'Barey2',
    passToNext: false,
    value: 0.5,
    type: undefined
  }

  t.deepEqual(
    generator.next(uniqueId).value,
    put(rNodeCreate(uniqueId, modifier)),
    '4x. Create node (modifier)'
  )

  link.modifierIds = ['xxx', 'yyy']

  t.deepEqual(
    generator.next().value,
    put(rInputLinkCreate(linkId, link)),
    '4x. Create input link'
  )

  t.equal(generator.next().done, true, 'Generator ends')
  t.end()
})
