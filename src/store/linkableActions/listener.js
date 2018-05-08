import { rLinkableActionDelete } from './actions'
import { uInputLinkDelete } from '../inputLinks/actions'
import getLinkableAction from '../../selectors/getLinkableAction'

const handleDelete = (action, store) => {
  const state = store.getState()
  const p = action.payload
  const linkableAction = getLinkableAction(state, p.id)
  linkableAction.inputLinkIds.forEach(id => {
    store.dispatch(uInputLinkDelete(id))
  })

  store.dispatch(rLinkableActionDelete(p.id))
}

export default (action, store) => {
  switch (action.type) {
    case 'LINKABLE_ACTION_DELETE':
      handleDelete(action, store)
      break
  }
}
