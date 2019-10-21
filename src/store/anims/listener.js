import getInputLink from '../../selectors/getInputLink'
import getNode from '../../selectors/getNode'
import getNodesValues from '../../selectors/getNodesValues'
import { nodeValueUpdate } from '../nodes/actions'
import { get } from 'lodash'

const { TWEEN } = window.HEDRON.dependencies

const handleAnimStart = (action, store) => {
  const state = store.getState()
  const inputLink = getInputLink(state, action.payload.linkId)
  const node = getNode(state, inputLink.nodeId)
  const opts = getNodesValues(state, inputLink.optionIds)
  const duration = opts.duration * 10000
  const easing = get(TWEEN.Easing, opts.curve)

  const props = {
    nodeValue: node.value,
  }

  new TWEEN.Tween(props)
    .to({ nodeValue: opts.targetVal }, duration)
    .easing(easing)
    .onUpdate(() => {
      store.dispatch(nodeValueUpdate(inputLink.nodeId, props.nodeValue))
    })
    .start()
}

export default (action, store) => {
  switch (action.type) {
    case 'U_ANIM_START':
      handleAnimStart(action, store)
      break
  }
}
