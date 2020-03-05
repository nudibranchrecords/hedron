import { fork } from 'redux-saga/effects'
import { watchClock } from './clock/sagas'
import { watchMacros } from './macros/sagas'

export default function* rootSaga (dispatch) {
  yield [
    fork(watchClock),
    fork(watchMacros),
  ]
}
