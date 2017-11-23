import 'babel-polyfill'
import test from 'tape'
import getNode from '../../../selectors/getNode'
import getMacro from '../../../selectors/getMacro'
import { shouldItLearn } from '../utils'
import getMacroTargetParamLink from '../../../selectors/getMacroTargetParamLink'
import getMacroLearningId from '../../../selectors/getMacroLearningId'
import macroInterpolate from '../../../utils/macroInterpolate'
import { select, put, call } from 'redux-saga/effects'
import { rNodeCreate, nodeValueUpdate } from '../../nodes/actions'
import {
  rMacroTargetParamLinkUpdateStartValue,
  uMacroCreate, rMacroCreate, uMacroTargetParamLinkAdd, rMacroTargetParamLinkCreate
} from '../actions'
import {
  macroCreate, macroTargetParamLinkAdd, macroProcess, handleNodeValueUpdate,
  macroLearnFromParam
} from '../sagas'
import uid from 'uid'

test('(Saga) macroLearnFromParam (link doesnt exist)', (t) => {
  const paramId = 'XXX'
  const newVal = 0.5
  const action = nodeValueUpdate(paramId, newVal)
  const macroId = 'LEARNINGID'

  const generator = macroLearnFromParam(action.payload, macroId)

  t.deepEqual(
    generator.next().value,
    select(getMacroTargetParamLink, macroId, paramId),
    '0. Check for link'
  )

  let link

  t.deepEqual(
    generator.next(link).value,
    call(macroTargetParamLinkAdd, uMacroTargetParamLinkAdd(macroId, paramId)),
    '1. Create new macro link'
  )

  t.deepEqual(
    generator.next().value,
    select(getMacroTargetParamLink, macroId, paramId),
    '2. Get new link'
  )

  link = {
    id: 'LINKID',
    nodeId: 'NODEID'
  }

  t.deepEqual(
    generator.next(link).value,
    put(nodeValueUpdate('NODEID', newVal)),
    '1. Dispatch action to update link value'
  )

  t.equal(generator.next().done, true, 'Generator ends')
  t.end()
})

test('(Saga) macroLearnFromParam (link does exist)', (t) => {
  const paramId = 'XXX'
  const newVal = 0.5
  const action = nodeValueUpdate(paramId, newVal)
  const macroId = 'LEARNINGID'

  const generator = macroLearnFromParam(action.payload, macroId)

  t.deepEqual(
    generator.next().value,
    select(getMacroTargetParamLink, macroId, paramId),
    '0. Check for link'
  )

  const link = {
    id: 'LINKID',
    nodeId: 'NODEID'
  }

  t.deepEqual(
    generator.next(link).value,
    put(nodeValueUpdate('NODEID', newVal)),
    '1. Dispatch action to update link value'
  )

  t.equal(generator.next().done, true, 'Generator ends')
  t.end()
})

test('(Saga) handleNodeValueUpdate (does nothing if node value update isnt a macro AND it shouldnt learn)', (t) => {
  const nodeId = 'XXX'
  const newVal = 0.5
  const action = nodeValueUpdate(nodeId, newVal)
  const generator = handleNodeValueUpdate(action)

  t.deepEqual(
    generator.next().value,
    select(getNode, 'XXX'),
    '0. Get node'
  )

  const node = {
    type: 'foo'
  }

  t.deepEqual(
    generator.next(node).value,
    select(getMacroLearningId),
    '1. Check macro learning Id'
  )

  const id = true

  t.deepEqual(
    generator.next(id).value,
    call(shouldItLearn, id, node, action.payload),
    '2. Check if node should learn'
  )

  const learn = false

  t.equal(generator.next(learn).done, true, 'Generator ends')
  t.end()
})

test('(Saga) handleNodeValueUpdate (call macroProcess if node is macro)', (t) => {
  const nodeId = 'XXX'
  const newVal = 0.5
  const action = nodeValueUpdate(nodeId, newVal)
  const generator = handleNodeValueUpdate(action)

  t.deepEqual(
    generator.next().value,
    select(getNode, 'XXX'),
    '0. Get node'
  )

  const node = {
    type: 'macro'
  }

  t.deepEqual(
    generator.next(node).value,
    select(getMacroLearningId),
    '1. Check macro learning Id'
  )

  const id = false

  t.deepEqual(
    generator.next(id).value,
    call(macroProcess, action.payload, node),
    '2. Call macroProcess, passing in action payload and node'
  )

  t.equal(generator.next().done, true, 'Generator ends')
  t.end()
})

test('(Saga) handleNodeValueUpdate (call macroProcess if node is macro, ignore learningId)', (t) => {
  const nodeId = 'XXX'
  const newVal = 0.5
  const action = nodeValueUpdate(nodeId, newVal)
  const generator = handleNodeValueUpdate(action)

  t.deepEqual(
    generator.next().value,
    select(getNode, 'XXX'),
    '0. Get node'
  )

  const node = {
    type: 'macro'
  }

  t.deepEqual(
    generator.next(node).value,
    select(getMacroLearningId),
    '1. Check macro learning Id'
  )

  const id = 1

  t.deepEqual(
    generator.next(id).value,
    call(macroProcess, action.payload, node),
    '2. Call macroProcess, passing in action payload and node'
  )

  t.equal(generator.next().done, true, 'Generator ends')
  t.end()
})

test('(Saga) handleNodeValueUpdate (call macroLearnFromParam if learning ID and not a macro)', (t) => {
  const nodeId = 'XXX'
  const newVal = 0.5
  const action = nodeValueUpdate(nodeId, newVal)
  const generator = handleNodeValueUpdate(action)

  t.deepEqual(
    generator.next().value,
    select(getNode, 'XXX'),
    '0. Get node'
  )

  const node = {
    type: 'foo'
  }

  t.deepEqual(
    generator.next(node).value,
    select(getMacroLearningId),
    '1. Check macro learning Id'
  )

  const id = 'XXX'

  t.deepEqual(
    generator.next(id).value,
    call(shouldItLearn, id, node, action.payload),
    '2. Check if node should learn'
  )

  const learn = true

  t.deepEqual(
    generator.next(learn).value,
    call(macroLearnFromParam, action.payload, id),
    '2. Call macroLearnFromParam, passing in action payload and learningId'
  )

  t.equal(generator.next().done, true, 'Generator ends')
  t.end()
})

test('(Saga) macroProcess (update linked params with correct val, start vals exist)', (t) => {
  const nodeId = 'XXX'
  const newVal = 0.5

  const node = {
    type: 'macro',
    macroId: 'YYY'
  }

  const generator = macroProcess(nodeValueUpdate(nodeId, newVal).payload, node)

  t.deepEqual(
    generator.next(node).value,
    select(getMacro, 'YYY'),
    '1. Get macro'
  )

  const macro = {
    targetParamLinks: {
      p1: {
        nodeId: 'n1',
        paramId: 'p1',
        startValue: 0.2
      },
      p2: {
        nodeId: 'n2',
        paramId: 'p2',
        startValue: 0.5
      }
    }
  }

  t.deepEqual(
    generator.next(macro).value,
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
    generator.next().value,
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
  const macroId = 'YYY'
  const newVal = 0.5
  const node = {
    type: 'macro',
    macroId
  }

  const generator = macroProcess(nodeValueUpdate(nodeId, newVal).payload, node)

  t.deepEqual(
    generator.next(node).value,
    select(getMacro, 'YYY'),
    '1. Get macro'
  )

  const macro = {
    targetParamLinks: {
      p1: {
        id: 'l1',
        nodeId: 'n1',
        paramId: 'p1',
        startValue: false
      }
    }
  }

  t.deepEqual(
    generator.next(macro).value,
    select(getNode, 'p1'),
    '3.0 No start value, get param val'
  )

  const param = {
    value: 0.8
  }

  t.deepEqual(
    generator.next(param).value,
    put(rMacroTargetParamLinkUpdateStartValue(macroId, 'p1', 0.8)),
    '3.1 Update startValue for link'
  )

  t.deepEqual(
    generator.next().value,
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
    '1. Generate unique ID for node'
  )

  const nodeId = 'NODE01'

  t.deepEqual(
    generator.next(nodeId).value,
    put(rNodeCreate(nodeId, {
      title: 'Foo Param',
      type: 'macroTargetParamLink'
    })),
    '2. Create node item in state'
  )

  t.deepEqual(
    generator.next().value,
    put(rMacroTargetParamLinkCreate(macroId, paramId, nodeId)),
    '3. Create param link in state'
  )

  t.equal(generator.next().done, true, 'Generator ends')
  t.end()
})
