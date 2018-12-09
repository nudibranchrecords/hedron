import getInputLink from '../../selectors/getInputLink'
import getNode from '../../selectors/getNode'
import { nodeValueUpdate } from '../nodes/actions'
import TWEEN from '@tweenjs/tween.js'

const handleAnimStart = (action, store) => {
  const state = store.getState()
  const inputLink = getInputLink(state, action.payload.linkId)
  const node = getNode(state, inputLink.nodeId)
  const props = {
    nodeValue: node.value,
  }

  new TWEEN.Tween(props)
    .to({ nodeValue: 0.9 }, 1000)
    .easing(TWEEN.Easing.Quadratic.Out)
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
