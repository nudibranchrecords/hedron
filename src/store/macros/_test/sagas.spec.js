import 'babel-polyfill'
import test from 'tape'
import getNode from '../../../selectors/getNode'
import getMacro from '../../../selectors/getMacro'
import { shouldItLearn } from '../utils'
import getMacroTargetParamLink from '../../../selectors/getMacroTargetParamLink'
import getMacroLearningId from '../../../selectors/getMacroLearningId'
import getMacroLastId from '../../../selectors/getMacroLastId'
import macroInterpolate from '../../../utils/macroInterpolate'
import isInputTypeHuman from '../../../utils/isInputTypeHuman'
import { select, put, call } from 'redux-saga/effects'
import {
  rNodeCreate, nodeValueUpdate, rNodeConnectedMacroAdd,
  nodeValuesBatchUpdate,
} from '../../nodes/actions'
import {
  rMacroTargetParamLinkUpdateStartValue, rMacroUpdateLastId, rMacroOpenToggle,
  uMacroCreate, rMacroCreate, uMacroTargetParamLinkAdd, rMacroTargetParamLinkCreate,
} from '../actions'
import { uiEditingOpen } from '../../ui/actions'
import {
  macroCreate, macroTargetParamLinkAdd, macroProcess, handleNodeValueUpdate,
  macroLearnFromParam, handleNodeValueBatchUpdate,
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
    nodeId: 'NODEID',
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
    nodeId: 'NODEID',
  }

  t.deepEqual(
    generator.next(link).value,
    put(nodeValueUpdate('NODEID', newVal)),
    '1. Dispatch action to update link value'
  )

  t.equal(generator.next().done, true, 'Generator ends')
  t.end()
})

test(`(Saga) handleNodeValueUpdate (does nothing if node type isn't macro and sender isn't human)`, (t) => {
  const nodeId = 'XXX'
  const newVal = 0.5
  const action = nodeValueUpdate(nodeId, newVal, { type: 'alien' })
  const generator = handleNodeValueUpdate(action)

  t.deepEqual(
    generator.next(isHuman).value,
    select(getNode, 'XXX'),
    '0. Get node'
  )

  const node = {
    type: '@@@',
  }

  t.deepEqual(
    generator.next(node).value,
    call(isInputTypeHuman, 'alien'),
    '0. Check if input type is human'
  )

  const isHuman = false

  t.equal(generator.next(isHuman).done, true, 'Generator ends')
  t.end()
})

test(`(Saga) handleNodeValueUpdate
  (does nothing if node type isnt a macro AND is human AND it shouldnt learn
  AND it doesnt have any connectedMacroIds)`, (t) => {
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
    type: 'foo',
    connectedMacroIds: [],
  }

  t.deepEqual(
    generator.next(node).value,
    call(isInputTypeHuman, undefined),
    '0. Check if input type is human'
  )

  const isHuman = true

  t.deepEqual(
    generator.next(isHuman).value,
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

test(`(Saga) handleNodeValueUpdate (does nothing if input is from a macro and node type is macro)`, (t) => {
  const nodeId = 'XXX'
  const newVal = 0.5
  const action = nodeValueUpdate(nodeId, newVal, { type: 'macro' })
  const generator = handleNodeValueUpdate(action)

  t.deepEqual(
    generator.next().value,
    select(getNode, 'XXX'),
    '0. Get node'
  )

  const node = {
    type: 'macro',
  }

  t.equal(generator.next(node).done, true, 'Generator ends')
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
    type: 'macro',
  }

  t.deepEqual(
    generator.next(node).value,
    call(macroProcess, action.payload, node),
    '2. Call macroProcess, passing in action payload and node'
  )

  t.equal(generator.next().done, true, 'Generator ends')
  t.end()
})

test(`(Saga) handleNodeValueUpdate
(Reset macro and start values and ALL links for connected macros if has connectedMacroIds)`, (t) => {
  const paramId = 'PARAMID'
  const newVal = 0.5
  const action = nodeValueUpdate(paramId, newVal)
  const generator = handleNodeValueUpdate(action)

  t.deepEqual(
    generator.next().value,
    select(getNode, paramId),
    '0. Get node'
  )

  const node = {
    type: 'foo',
    connectedMacroIds: ['macro01', 'macro02'],
  }

  t.deepEqual(
      generator.next(node).value,
      call(isInputTypeHuman, undefined),
      '0. Check if input type is human'
    )

  const isHuman = true

  t.deepEqual(
    generator.next(isHuman).value,
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

  t.deepEqual(
    generator.next(learn).value,
    select(getMacro, 'macro01'),
    '3.0 Get macro'
  )

  const macro = {
    nodeId: 'n1',
    targetParamLinks: {
      foo: {
        startValue: 0.5,
      },
      bar: {
        startValue: 0.1,
      },
    },
  }

  t.deepEqual(
    generator.next(macro).value,
    select(getNode, 'n1'),
    '4.0 Get node'
  )

  const macroNode = {
    value: 0.5,
  }

  t.deepEqual(
    generator.next(macroNode).value,
    put(rMacroTargetParamLinkUpdateStartValue('macro01', 'foo', false)),
    '5.1 Reset macro link'
  )

  t.deepEqual(
    generator.next(macro).value,
    put(rMacroTargetParamLinkUpdateStartValue('macro01', 'bar', false)),
    '5.2 Reset macro link'
  )

  t.deepEqual(
    generator.next().value,
    put(nodeValueUpdate('n1', false, { type: 'macro' })),
    '4.2 Reset macro node with "false" and meta type: macro to stop it from processing the macro'
  )

  t.deepEqual(
    generator.next(learn).value,
    select(getMacro, 'macro02'),
    '6.0 Get macro'
  )

  const macro2 = {
    nodeId: 'n2',
    targetParamLinks: {
      lorem: {
        startValue: 0.1,
      },
    },
  }

  t.deepEqual(
      generator.next(macro2).value,
      select(getNode, 'n2'),
      '6.0 Get node'
    )

  const macroNode2 = {
    value: 0.2,
  }

  t.deepEqual(
    generator.next(macroNode2).value,
    put(rMacroTargetParamLinkUpdateStartValue('macro02', 'lorem', false)),
    '4.1 Reset macro link'
  )

  t.deepEqual(
    generator.next().value,
    put(nodeValueUpdate('n2', false, { type: 'macro' })),
    '4.2 Reset macro node with "false" and meta type: macro to stop it from processing the macro'
  )

  t.equal(generator.next().done, true, 'Generator ends')
  t.end()
})

test(`(Saga) handleNodeValueUpdate
(Reset macro and start values and ALL links
for connected macros if has connectedMacroIds,
when action called via another macro,
except for the macro being called)`, (t) => {
  const paramId = 'PARAMID'
  const newVal = 0.5
  const action = nodeValueUpdate(paramId, newVal, { type: 'macro', macroId: 'macro01' })
  const generator = handleNodeValueUpdate(action)

  t.deepEqual(
    generator.next().value,
    select(getNode, paramId),
    '0. Get node'
  )

  const node = {
    type: 'foo',
    connectedMacroIds: ['macro01', 'macro02'],
  }

  t.deepEqual(
    generator.next(node).value,
    call(isInputTypeHuman, 'macro'),
    '0. Check if input type is human'
  )

  const isHuman = true

  t.deepEqual(
    generator.next(isHuman).value,
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

  t.deepEqual(
    generator.next(learn).value,
    select(getMacro, 'macro02'),
    '4.0 Get macro'
  )

  const macro2 = {
    nodeId: 'n2',
    targetParamLinks: {
      lorem: {
        startValue: 0.5,
      },
    },
  }

  t.deepEqual(
      generator.next(macro2).value,
      select(getNode, 'n2'),
      '6.0 Get node'
    )

  const macroNode2 = {
    value: 0.2,
  }

  t.deepEqual(
    generator.next(macroNode2).value,
    put(rMacroTargetParamLinkUpdateStartValue('macro02', 'lorem', false)),
    '4.1 Reset macro link'
  )

  t.deepEqual(
    generator.next().value,
    put(nodeValueUpdate('n2', false, { type: 'macro' })),
    '4.2 Reset macro node, meta type: macro to stop it from processing the macro'
  )

  t.equal(generator.next().done, true, 'Generator ends (dont reset macro)')
  t.end()
})

test(`(Saga) handleNodeValueUpdate
(Dont Reset macro or start values for links if macro node
is already set to false, as this signifies it has already been reset)`, (t) => {
  const paramId = 'PARAMID'
  const newVal = 0.5
  const action = nodeValueUpdate(paramId, newVal, { type: 'macro', macroId: 'macro01' })
  const generator = handleNodeValueUpdate(action)

  t.deepEqual(
    generator.next().value,
    select(getNode, paramId),
    '0. Get node'
  )

  const node = {
    type: 'foo',
    connectedMacroIds: ['macro05'],
  }

  t.deepEqual(
    generator.next(node).value,
    call(isInputTypeHuman, 'macro'),
    '0. Check if input type is human'
  )

  const isHuman = true

  t.deepEqual(
    generator.next(isHuman).value,
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

  t.deepEqual(
    generator.next(learn).value,
    select(getMacro, 'macro05'),
    '4.0 Get macro'
  )

  const macro2 = {
    nodeId: 'n2',
    targetParamLinks: {
      lorem: {
        startValue: 0.5,
      },
    },
  }

  t.deepEqual(
      generator.next(macro2).value,
      select(getNode, 'n2'),
      '6.0 Get node'
    )

  const macroNode2 = {
    value: false,
  }

  t.equal(generator.next(macroNode2).done, true, 'Generator ends (dont reset macro)')
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
    type: 'foo',
  }

  t.deepEqual(
    generator.next(node).value,
    call(isInputTypeHuman, undefined),
    '0. Check if input type is human'
  )

  const isHuman = true

  t.deepEqual(
    generator.next(isHuman).value,
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
    macroId: 'YYY',
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
        startValue: 0.2,
      },
      p2: {
        nodeId: 'n2',
        paramId: 'p2',
        startValue: 0.5,
      },
    },
  }

  t.deepEqual(
    generator.next(macro).value,
    select(getNode, 'n1'),
    '3.0 Get node for link 1'
  )

  const node1 = {
    value: 0.3,
  }

  t.deepEqual(
    generator.next(node1).value,
    // start value, target value, interp value
    call(macroInterpolate, 0.2, 0.3, 0.5),
    '3.1 Call interpolation function'
  )

  const val1 = 0.22222

  t.deepEqual(
    generator.next(val1).value,
    select(getNode, 'n2'),
    '3.0 Get node for link 2'
  )

  const node2 = {
    value: 0.6,
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
    put(nodeValuesBatchUpdate([
      {
        id: 'p1',
        value: val1,
      },
      {
        id: 'p2',
        value: val2,
      },
    ], { type: 'macro', macroId: 'YYY' })),
    '4 Update values in one action'
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
    macroId,
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
        startValue: false,
      },
    },
  }

  t.deepEqual(
    generator.next(macro).value,
    select(getNode, 'p1'),
    '3.0 No start value, get param val'
  )

  const param = {
    value: 0.8,
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
    value: 0.3,
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
    put(nodeValuesBatchUpdate([
      {
        id: 'p1',
        value: val,
      },
    ], { type: 'macro', macroId: 'YYY' })),
    '4 Update values in one action'
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
      value: 0,
      isOpen: true,
    })),
    '2. Create node item in state'
  )

  t.deepEqual(
    generator.next().value,
    put(rMacroCreate('XX1', 'XX2')),
    '3. Create macro item in state'
  )

  t.deepEqual(
    generator.next().value,
    put(rMacroOpenToggle('XX1')),
    '4. Open newly created macro'
  )

  t.deepEqual(
    generator.next().value,
    put(uiEditingOpen('nodeTitle', 'XX2')),
    '5. Open macro title edit'
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
    title: 'Foo Param',
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
      type: 'macroTargetParamLink',
    })),
    '2. Create node item in state'
  )

  t.deepEqual(
    generator.next().value,
    put(rMacroTargetParamLinkCreate(macroId, paramId, nodeId)),
    '3. Create param link in state'
  )

  t.deepEqual(
    generator.next().value,
    put(rNodeConnectedMacroAdd(paramId, macroId)),
    '4. Add macro id to param node'
  )

  t.equal(generator.next().done, true, 'Generator ends')
  t.end()
})

test('(Saga) handleNodeValueBatchUpdate - Any type apart from macro, loop through', (t) => {
  const meta = { type: '@@@' }
  const generator = handleNodeValueBatchUpdate(
    nodeValuesBatchUpdate([
      {
        id: 'xx',
        value: 0.1,
      },
      {
        id: 'yy',
        value: 0.2,
      },
    ], meta)
  )

  t.deepEqual(
    generator.next().value,
    call(handleNodeValueUpdate, {
      payload: {
        meta,
        id: 'xx',
        value: 0.1,
      },
    }),
    '3.1 Call node update handle saga'
  )

  t.deepEqual(
    generator.next().value,
    call(handleNodeValueUpdate, {
      payload: {
        meta,
        id: 'yy',
        value: 0.2,
      },
    }),
    '3.2 Call node update handle saga'
  )

  t.equal(generator.next().done, true, 'Generator ends')
  t.end()
})

test(`(Saga) handleNodeValueBatchUpdate - do nothing if macro value isnt false
AND lastId matches`, (t) => {
  const generator = handleNodeValueBatchUpdate(
    nodeValuesBatchUpdate([
      {
        id: 'xx',
        value: 0.1,
      },
      {
        id: 'yy',
        value: 0.2,
      },
    ], { type: 'macro', macroId: 'fooMacro' })
  )

  t.deepEqual(
    generator.next().value,
    select(getMacro, 'fooMacro'),
    '1. Get macro'
  )

  const macro = {
    nodeId: 'node1',
  }

  t.deepEqual(
    generator.next(macro).value,
    select(getNode, 'node1'),
    '2. Get node'
  )

  const node = {
    value: 0.5,
  }

  t.deepEqual(
    generator.next(node).value,
    select(getMacroLastId),
    '1. Get macro last id'
  )

  const lastId = 'fooMacro'

  t.equal(generator.next(lastId).done, true, 'Generator ends')
  t.end()
})

test('(Saga) handleNodeValueBatchUpdate - loop through param values if macro value is false', (t) => {
  const meta = { type: 'macro', macroId: 'fooMacro' }
  const generator = handleNodeValueBatchUpdate(
    nodeValuesBatchUpdate([
      {
        id: 'xx',
        value: 0.1,
      },
      {
        id: 'yy',
        value: 0.2,
      },
    ], meta)
  )

  t.deepEqual(
    generator.next().value,
    select(getMacro, 'fooMacro'),
    '1. Get macro'
  )

  const macro = {
    nodeId: 'node1',
  }

  t.deepEqual(
    generator.next(macro).value,
    select(getNode, 'node1'),
    '2. Get node'
  )

  const node = {
    value: false,
  }

  t.deepEqual(
    generator.next(node).value,
    call(handleNodeValueUpdate, {
      payload: {
        meta,
        id: 'xx',
        value: 0.1,
      },
    }),
    '3.1 Call node update handle saga'
  )

  t.deepEqual(
    generator.next(node).value,
    call(handleNodeValueUpdate, {
      payload: {
        meta,
        id: 'yy',
        value: 0.2,
      },
    }),
    '3.2 Call node update handle saga'
  )

  t.deepEqual(
    generator.next().value,
    put(rMacroUpdateLastId(meta.macroId)),
    '4. Dispatch action to set this macro as last one'
  )

  t.equal(generator.next().done, true, 'Generator ends')
  t.end()
})

test(`(Saga) handleNodeValueBatchUpdate - loop through param values if macro value isnt false
BUT lastId doesnt match`, (t) => {
  const meta = { type: 'macro', macroId: 'fooMacro' }
  const generator = handleNodeValueBatchUpdate(
    nodeValuesBatchUpdate([
      {
        id: 'xx',
        value: 0.1,
      },
      {
        id: 'yy',
        value: 0.2,
      },
    ], meta)
  )

  t.deepEqual(
    generator.next().value,
    select(getMacro, 'fooMacro'),
    '1. Get macro'
  )

  const macro = {
    nodeId: 'node1',
  }

  t.deepEqual(
    generator.next(macro).value,
    select(getNode, 'node1'),
    '2. Get node'
  )

  const node = {
    value: 0.2,
  }

  t.deepEqual(
    generator.next(node).value,
    select(getMacroLastId),
    '1. Get macro last id'
  )

  const lastId = '@@@@@@'

  t.deepEqual(
    generator.next(lastId).value,
    call(handleNodeValueUpdate, {
      payload: {
        meta,
        id: 'xx',
        value: 0.1,
      },
    }),
    '3.1 Call node update handle saga'
  )

  t.deepEqual(
    generator.next(node).value,
    call(handleNodeValueUpdate, {
      payload: {
        meta,
        id: 'yy',
        value: 0.2,
      },
    }),
    '3.2 Call node update handle saga'
  )

  t.deepEqual(
    generator.next().value,
    put(rMacroUpdateLastId(meta.macroId)),
    '4. Dispatch action to set this macro as last one'
  )

  t.equal(generator.next().done, true, 'Generator ends')
  t.end()
})
