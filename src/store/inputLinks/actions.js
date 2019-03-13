export function uInputLinkCreate (nodeId, inputId, inputType, meta = {}) {
  return {
    type: 'U_INPUT_LINK_CREATE',
    payload: {
      nodeId,
      inputId,
      inputType,
      meta,
    },
  }
}

export function rInputLinkAdd (id, link) {
  return {
    type: 'R_INPUT_LINK_ADD',
    payload: {
      id,
    },
  }
}

export function uInputLinkDelete (id) {
  return {
    type: 'U_INPUT_LINK_DELETE',
    payload: {
      id,
    },
  }
}

export function rInputLinkDelete (id) {
  return {
    type: 'R_INPUT_LINK_DELETE',
    payload: {
      id,
    },
  }
}

export function uInputLinkUpdateMidiInput (linkId) {
  return {
    type: 'U_INPUT_LINK_UPDATE_MIDI_INPUT',
    payload: {
      linkId,
    },
  }
}

export function inputLinksReplaceAll (links) {
  return {
    type: 'INPUT_LINKS_REPLACE_ALL',
    payload: {
      links,
    },
  }
}
