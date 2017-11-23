import 'babel-polyfill'
import test from 'tape'
import getNode from '../../../selectors/getNode'
import getMacro from '../../../selectors/getMacro'
import macroInterpolate from '../../../utils/macroInterpolate'
import getMacroTargetParamLinks from '../../../selectors/getMacroTargetParamLinks'
import { select, put, call } from 'redux-saga/effects'
import { rNodeCreate, nodeValueUpdate } from '../../nodes/actions'
import { rMacroTargetParamLinkCreate, rMacroTargetParamLinkUpdateStartValue } from '../../macroTargetParamLinks/actions'
import {
  uMacroCreate, rMacroCreate, uMacroTargetParamLinkAdd, rMacroTargetParamLinkAdd
} from '../actions'
import { macroCreate, macroTargetParamLinkAdd, macroProcess } from '../sagas'

import uid from 'uid'

test('(Saga) macroProcess (does nothing if node value update isnt a macro)', (t) => {
  const nodeId = 'XXX'
  const newVal = 0.5
  const generator = macroProcess(nodeValueUpdate(nodeId, newVal))

  t.deepEqual(
    generator.next().value,
    select(getNode, 'XXX'),
    '0. Get node'
  )

  const node = {
    type: 'foo'
  }

  t.equal(generator.next(node).done, true, 'Generator ends')
  t.end()
})

test('(Saga) macroProcess (update linked params with correct val, start vals exist)', (t) => {
  const nodeId = 'XXX'
  const newVal = 0.5
  const generator = macroProcess(nodeValueUpdate(nodeId, newVal))

  t.deepEqual(
    generator.next().value,
    select(getNode, 'XXX'),
    '0. Get node'
  )

  const node = {
    type: 'macro',
    macroId: 'YYY'
  }

  t.deepEqual(
    generator.next(node).value,
    select(getMacro, 'YYY'),
    '1. Get macro'
  )

  const macro = {
    targetParamLinks: ['l1', 'l2']
  }

  t.deepEqual(
    generator.next(macro).value,
    select(getMacroTargetParamLinks, ['l1', 'l2']),
    '2. Get macro target param links'
  )

  const links = [
    {
      id: 'l1',
      nodeId: 'n1',
      paramId: 'p1',
      startValue: 0.2
    },
    {
      id: 'l2',
      nodeId: 'n2',
      paramId: 'p2',
      startValue: 0.5
    }
  ]

  t.deepEqual(
    generator.next(links).value,
    select(getNode, 'n1'),
    '3.0 Get node for link 1'
  )

  const node1 = {
    value: 0.3
  }

  t.deepEqual(
    generator.next(node1).value,
    // start value, target value, interp value
    call(macroInterpolate, 0.2, 0.3, 0.5),
    '3.1 Call interpolation function'
  )

  const val = 0.88888

  t.deepEqual(
    generator.next(val).value,
    put(nodeValueUpdate('p1', val)),
    '3.1 Update target param'
  )

  t.deepEqual(
    generator.next(links).value,
    select(getNode, 'n2'),
    '3.0 Get node for link 2'
  )

  const node2 = {
    value: 0.6
  }

  t.deepEqual(
    generator.next(node2).value,
    // start value, target value, interp value
    call(macroInterpolate, 0.5, 0.6, 0.5),
    '3.1 Call interpolation function'
  )

  const val2 = 0.88888

  t.deepEqual(
    generator.next(val2).value,
    put(nodeValueUpdate('p2', val2)),
    '3.1 Update target param'
  )

  t.equal(generator.next().done, true, 'Generator ends')
  t.end()
})

test('(Saga) macroProcess (update linked params with correct val, start vals dont exist)', (t) => {
  const nodeId = 'XXX'
  const newVal = 0.5
  const generator = macroProcess(nodeValueUpdate(nodeId, newVal))

  t.deepEqual(
    generator.next().value,
    select(getNode, 'XXX'),
    '0. Get node'
  )

  const node = {
    type: 'macro',
    macroId: 'YYY'
  }

  t.deepEqual(
    generator.next(node).value,
    select(getMacro, 'YYY'),
    '1. Get macro'
  )

  const macro = {
    targetParamLinks: ['l1']
  }

  t.deepEqual(
    generator.next(macro).value,
    select(getMacroTargetParamLinks, ['l1']),
    '2. Get macro target param links'
  )

  const links = [
    {
      id: 'l1',
      nodeId: 'n1',
      paramId: 'p1',
      startValue: false
    }
  ]

  t.deepEqual(
    generator.next(links).value,
    select(getNode, 'p1'),
    '3.0 No start value, get param val'
  )

  const param = {
    value: 0.8
  }

  t.deepEqual(
    generator.next(param).value,
    put(rMacroTargetParamLinkUpdateStartValue('l1', 0.8)),
    '3.1 Update startValue for link'
  )

  t.deepEqual(
    generator.next(links).value,
    select(getNode, 'n1'),
    '3.2 Get node for link 1'
  )

  const node1 = {
    value: 0.3
  }

  t.deepEqual(
    generator.next(node1).value,
    // start value, target value, interp value
    call(macroInterpolate, 0.8, 0.3, 0.5),
    '3.3 Call interpolation function'
  )

  const val = 0.88888

  t.deepEqual(
    generator.next(val).value,
    put(nodeValueUpdate('p1', val)),
    '3.4 Update target param'
  )

  t.equal(generator.next().done, true, 'Generator ends')
  t.end()
})

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
      title: 'New Macro',
      type: 'macro',
      macroId: UID1,
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

test('(Saga) macroTargetParamLinkAdd', (t) => {
  const paramId = 'PARAM01'
  const macroId = 'MACRO01'
  const generator = macroTargetParamLinkAdd(uMacroTargetParamLinkAdd(macroId, paramId))

  t.deepEqual(
    generator.next().value,
    select(getNode, paramId),
    '0. Get param (node)'
  )

  const param = {
    title: 'Foo Param'
  }

  t.deepEqual(
    generator.next(param).value,
    call(uid),
    '0.1 Generate unique ID for link'
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
      title: 'Foo Param'
    })),
    '2. Create node item in state'
  )

  t.deepEqual(
    generator.next().value,
    put(rMacroTargetParamLinkCreate(UID1, UID2, paramId)),
    '3. Create param link in state'
  )

  t.deepEqual(
    generator.next().value,
    put(rMacroTargetParamLinkAdd(macroId, UID1)),
    '4. Add link id to macro'
  )

  t.equal(generator.next().done, true, 'Generator ends')
  t.end()
})
