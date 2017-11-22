export function uMacroCreate () {
  return {
    type: 'U_MACRO_CREATE'
  }
}

export function rMacroCreate (id, nodeId) {
  return {
    type: 'R_MACRO_CREATE',
    payload: { id, nodeId }
  }
}
