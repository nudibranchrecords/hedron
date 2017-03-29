export function paramUpdate (paramId, value = 0.5) {
  return {
    type: 'PARAM_VALUE_UPDATE',
    payload: { paramId, value }
  }
}
