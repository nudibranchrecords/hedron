export function paramValueUpdate (id, value) {
  return {
    type: 'PARAM_VALUE_UPDATE',
    payload: { id, value }
  }
}
