import 'babel-polyfill'
import test from 'tape'
import { select, put, call } from 'redux-saga/effects'
import { rNodeCreate } from '../../nodes/actions'
import { uMacroCreate, rMacroCreate } from '../actions'
import { macroCreate } from '../sagas'

import uid from 'uid'

test('(Saga) macroCreate', (t) => {
  const generator = macroCreate(uMacroCreate())

  t.deepEqual(
    generator.next().value,
    call(uid),
    '0. Generate unique ID for macro'
  )

  const UID1 = 'XX1'

  t.deepEqual(
    generator.next(UID1).value,
    call(uid),
    '1. Generate unique ID for node'
  )

  const UID2 = 'XX2'

  t.deepEqual(
    generator.next(UID2).value,
    put(rNodeCreate('XX2', {
      value: 0
    })),
    '2. Create node item in state'
  )

  t.deepEqual(
    generator.next().value,
    put(rMacroCreate('XX1', 'XX2')),
    '3. Create macro item in state'
  )

  t.equal(generator.next().done, true, 'Generator ends')
  t.end()
})
