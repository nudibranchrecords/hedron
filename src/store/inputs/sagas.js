import { select, takeEvery, put, call } from 'redux-saga/effects'
import { getAssignedLinks } from './selectors'
import { nodeValuesBatchUpdate, nodeShotFired, rNodeInputLinkShotDisarm, rNodeInputLinkShotArm } from '../nodes/actions'
import { projectError } from '../project/actions'
import getNodes from '../../selectors/getNodes'
import getNode from '../../selectors/getNode'
import getNodesValues from '../../selectors/getNodesValues'
import lfoProcess from '../../utils/lfoProcess'
import midiValueProcess from '../../utils/midiValueProcess'
import { work } from '../../externals/modifiers'
import debounceInput from '../../utils/debounceInput'

export function* handleInput (action) {
  const p = action.payload
  const inputType = p.meta && p.meta.type
  const messageCount = yield call(debounceInput, p)
  if (messageCount) {
    try {
      const links = yield select(getAssignedLinks, p.inputId)
      const values = []

      for (let i = 0; i < links.length; i++) {
        let skip
        let postModifiers = []
        const linkNode = yield select(getNode, links[i].nodeId)

        if (linkNode.type === 'linkableAction') {
          yield put(linkNode.action)
        } else {
          let value = p.value
          let modifiers
          if (inputType === 'midi') {
            let midiValue = value
            value = linkNode.value
            const options = yield select(getNodesValues, links[i].midiOptionIds)
            value = yield call(midiValueProcess, linkNode, midiValue, options, messageCount)
          }

          if (p.inputId === 'lfo') {
            let o = yield select(getNodesValues, links[i].lfoOptionIds)
            const seed = o.seed === -1 ? links[i].id : o.seed
            value = yield call(lfoProcess, value, o.shape, o.rate, o.phase, seed)
          }

          if (p.inputId === 'audio') {
            const o = yield select(getNodesValues, links[i].audioOptionIds)
            value = p.value[o.audioBand]
            if (o.increment !== 0) {
              const n = yield select(getNode, links[i].nodeId)
              if (o.increment === 1) {
                postModifiers.push((v) => ((n.value + v) % 1))
              } else {
                postModifiers.push((v) => ((((n.value - v) % 1) + 1) % 1))
              }
            }
          }

          if (links[i].modifierIds && links[i].modifierIds.length) {
            modifiers = yield select(getNodes, links[i].modifierIds)
            let vals = []
            for (let j = 0; j < modifiers.length; j++) {
              const m = modifiers[j]
              if (!m.type || m.type === inputType) {
                vals.push(m.value)
                if (!m.passToNext) {
                  value = yield call(work, m.key, vals, value)
                  value = Math.max(0, Math.min(1, value))
                  vals = []
                }
              }
            }
          }

          for (let i = 0; i < postModifiers.length; i++) {
            value = postModifiers[i](value)
          }

          switch (links[i].nodeType) {
            case 'shot': {
              if (p.meta && p.meta.noteOn) {
                yield put(nodeShotFired(links[i].nodeId, linkNode.sketchId, linkNode.method))
              } else if (p.inputId === 'seq-step') {
                const seqNode = yield select(getNode, links[i].sequencerGridId)
                if (seqNode.value[value] === 1) {
                  yield put(nodeShotFired(links[i].nodeId, linkNode.sketchId, linkNode.method))
                }
                skip = true
              } else if (value > 0.333 && links[i].armed) {
                yield put(nodeShotFired(links[i].nodeId, linkNode.sketchId, linkNode.method))
                yield put(rNodeInputLinkShotDisarm(links[i].id))
              } else if (value < 0.333) {
                yield put(rNodeInputLinkShotArm(links[i].id))
              }
              break
            }
            case 'macro': {
              if (p.meta && p.meta.noteOn) {
                value = 1
              }
            }
          }

          if (!skip) {
            values.push({
              id: links[i].nodeId,
              value,
            })
          }
        }
      }
      if (values.length) {
        yield put(nodeValuesBatchUpdate(values, p.meta))
      }
    } catch (error) {
      console.error(error)
      yield put(projectError(error.message))
    }
  }
}

export function* watchInputs () {
  yield takeEvery('INPUT_FIRED', handleInput)
}
