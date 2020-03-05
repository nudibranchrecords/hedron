import { fork } from 'redux-saga/effects'
import { watchMacros } from './macros/sagas'

export default function* rootSaga (dispatch) {
  yield [
    fork(watchMacros),
  ]
}
