export function linkableActionCreate (id, action) {
  return {
    type: 'LINKABLE_ACTION_CREATE',
    payload: { id, action }
  }
}

export function linkableActionDelete (id) {
  return {
    type: 'LINKABLE_ACTION_DELETE',
    payload: { id }
  }
}

export function linkableActionInputLinkAdd (id, linkId) {
  return {
    type: 'LINKABLE_ACTION_INPUT_LINK_ADD',
    payload: { id, linkId }
  }
}

export function linkableActionInputLinkRemove (id, linkId) {
  return {
    type: 'LINKABLE_ACTION_INPUT_LINK_REMOVE',
    payload: { id, linkId }
  }
}
