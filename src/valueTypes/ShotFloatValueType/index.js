import { BaseValueType } from '../BaseValueType'
import { nodeShotFired, rNodeInputLinkShotDisarm, rNodeInputLinkShotArm } from '../../store/nodes/actions'
import getNode from '../../selectors/getNode'
import ParamBar from '../FloatValueType/container'

export class ShotFloatValueType extends BaseValueType {
  defaultValue = 0
  Component = ParamBar

  doesValueMatch (value) {
    return typeof value === 'number'
  }

  compatibleInputs = {
    midi: {
      valueProcess: ({ actionPayload: p, store, inputLink, node }) => {
        if (p.meta && p.meta.noteOn) {
          store.dispatch(nodeShotFired(inputLink.nodeId, node.sketchId, node.method))
        }

        return null
      },
    },
    audio: {
      valueProcess: ({ value, options, store, inputLink, node }) => {
        value = value[options.audioBand]

        if (value > 0.333 && inputLink.armed) {
          store.dispatch(nodeShotFired(inputLink.nodeId, node.sketchId, node.method))
          store.dispatch(rNodeInputLinkShotDisarm(inputLink.id))
        } else if (value < 0.333) {
          store.dispatch(rNodeInputLinkShotArm(inputLink.id))
        }

        return value
      },
    },
    'seq-step': {
      valueProcess: ({ value, inputLink, store, node }) => {
        const seqNode = getNode(store.getState(), inputLink.sequencerGridId)
        if (seqNode.value[value] === 1) {
          store.dispatch(nodeShotFired(inputLink.nodeId, node.sketchId, node.method))
        }

        return null
      },
    },
  }
}
