export function uInputLinkCreate (id, link) {
  return {
    type: 'U_INPUT_LINK_CREATE',
    payload: {
      id,
      link
    }
  }
}

export function rInputLinkCreate (id, link) {
  return {
    type: 'R_INPUT_LINK_CREATE',
    payload: {
      id,
      link
    }
  }
}

export function uInputLinkDelete (id) {
  return {
    type: 'U_INPUT_LINK_DELETE',
    payload: {
      id
    }
  }
}

export function rInputLinkDelete (id) {
  return {
    type: 'R_INPUT_LINK_DELETE',
    payload: {
      id
    }
  }
}
