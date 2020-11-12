import { sendOutput } from '../../windows'

export function* handleSendOutput (action) {
  const p = action.payload
  sendOutput(p.index)
}

export default (action, store) => {
  switch (action.type) {
    case 'WINDOW_SEND_OUTPUT':
      handleSendOutput(action, store)
      break
  }
}
