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
import { getType } from '../../valueTypes'

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
        const linkNode = yield select(getNode, links[i].nodeId)

        if (linkNode.type === 'linkableAction') {
          yield put(linkNode.action)
        } else {
          let value = p.value
          let modifiers
          const options = yield select(getNodesValues, links[i].optionIds)
          const valueType = getType(linkNode.valueType)

          switch (inputType) {
            case 'midi': {
              const process = valueType.overrideMidiProcess || midiValueProcess
              value = yield call(process, { node: linkNode, value, options, messageCount })

              if (valueType.afterMidiProcess) {
                value = yield call(valueType.overrideMidiValueProcess, { node: linkNode, value, options, messageCount })
              }
              break
            }

            case 'lfo': {
              const seed = options.seed === -1 ? links[i].id : options.seed

              const process = valueType.overrideLfoProcess || lfoProcess
              value = yield call(process, { node: linkNode, value, options, seed, messageCount })

              if (valueType.afterLfoProcess) {
                value = yield call(valueType.afterLfoProcess, { node: linkNode, value, options, seed, messageCount })
              }
              break
            }

            case 'audio': {
              value = value[options.audioBand]

              if (valueType.afterAudioProcess) {
                value = yield call(valueType.afterAudioProcess, { node: linkNode, value, options, messageCount })
              }
              break
            }
          }

          if (links[i].modifierIds && links[i].modifierIds.length) {
            const n = yield select(getNode, links[i].nodeId)
            modifiers = yield select(getNodes, links[i].modifierIds)
            let vals = []
            for (let j = 0; j < modifiers.length; j++) {
              const m = modifiers[j]
              vals.push(m.value)
              if (!m.passToNext) {
                value = yield call(work, m.key, vals, value, n.value)
                value = Math.max(0, Math.min(1, value))
                vals = []
              }
            }
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
