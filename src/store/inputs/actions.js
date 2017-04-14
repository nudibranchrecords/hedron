export function inputFired (inputId, value) {
  return {
    type: 'INPUT_FIRED',
    payload: { inputId, value }
  }
}
