export function linkableActionCreate (id, action) {
  return {
    type: 'LINKABLE_ACTION_CREATE',
    payload: { id, action }
  }
}

export function linkableActionInputLinkAdd (id, linkId) {
  return {
    type: 'LINKABLE_ACTION_INPUT_LINK_ADD',
    payload: { id, linkId }
  }
}
