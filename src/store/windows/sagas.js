import { call, takeEvery } from 'redux-saga/effects'
import { sendOutput } from '../../windows'

export function* handleSendOutput (action) {
  const p = action.payload
  yield call(sendOutput, p.index)
}

export function* watchWindows () {
  yield takeEvery('WINDOW_SEND_OUTPUT', handleSendOutput)
}
