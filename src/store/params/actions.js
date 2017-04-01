export function paramValueUpdate (paramId, value = 0.5) {
  return {
    type: 'PARAM_VALUE_UPDATE',
    payload: { paramId, value }
  }
}
