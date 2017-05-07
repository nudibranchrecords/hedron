import { select, takeEvery, put, call } from 'redux-saga/effects'
import { getAssignedNodes } from './selectors'
import { nodeValueUpdate, nodeShotFired } from '../nodes/actions'
import { projectError } from '../project/actions'
import getNodes from '../../selectors/getNodes'
import getNodesValues from '../../selectors/getNodesValues'
import lfoProcess from '../../utils/lfoProcess'
import { work } from 'modifiers'

export function* handleInput (action) {
  const p = action.payload

  try {
    const nodes = yield select(getAssignedNodes, p.inputId)

    for (let i = 0; i < nodes.length; i++) {
      let value = p.value
      let modifiers

      if (p.inputId === 'lfo') {
        let o = yield select(getNodesValues, nodes[i].lfoOptionIds)
        value = yield call(lfoProcess, value, o.shape, o.rate)
      }

      if (nodes[i].modifierIds && nodes[i].modifierIds.length) {
        modifiers = yield select(getNodes, nodes[i].modifierIds)

        for (let j = 0; j < modifiers.length; j++) {
          const m = modifiers[j]
          if (!m.type || m.type === p.type) {
            value = yield call(work, m.key, m.value, value)
          }
        }
      }

      switch (nodes[i].type) {
        case 'select': {
          const options = nodes[i].options
          value = options[Math.floor(options.length * value)].value
          break
        }
        case 'shot': {
          yield put(nodeShotFired(nodes[i].sketchId, nodes[i].method))
        }
      }

      yield put(nodeValueUpdate(nodes[i].id, value))
    }
  } catch (error) {
    yield put(projectError(error.message))
  }
}

export function* watchInputs () {
  yield takeEvery('INPUT_FIRED', handleInput)
}
