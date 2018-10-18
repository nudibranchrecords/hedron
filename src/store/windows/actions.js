export function windowSendOutput (index) {
  return {
    type: 'WINDOW_SEND_OUTPUT',
    payload: {
      index,
    },
  }
}
