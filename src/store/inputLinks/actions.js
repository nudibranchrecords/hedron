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

export function rInputLinkCreate (id, link) {
  return {
    type: 'R_INPUT_LINK_CREATE',
    payload: {
      id,
      link,
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

export function rInputLinkUpdate (id, newProperties) {
  return {
    type: 'R_INPUT_LINK_UPDATE',
    payload: {
      id,
      newProperties,
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

export function inputLinkShotArm (id) {
  return {
    type: 'INPUT_LINK_SHOT_ARM',
    payload: {
      id,
    },
  }
}

export function inputLinkShotDisarm (id) {
  return {
    type: 'INPUT_LINK_SHOT_DISARM',
    payload: {
      id,
    },
  }
}
