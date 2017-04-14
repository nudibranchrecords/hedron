import { call, takeEvery } from 'redux-saga/effects'
import { sendOutput } from '../../windows'

export function* handleSendOutput () {
  yield call(sendOutput)
}

export function* watchWindows () {
  yield takeEvery('WINDOW_SEND_OUTPUT', handleSendOutput)
}

