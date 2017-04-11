import { fork } from 'redux-saga/effects'
import { watchSketches } from '../Engine/sagas'
import { watchProject } from './project/sagas'

export default function* rootSaga () {
  yield [
    fork(watchSketches),
    fork(watchProject)
  ]
}
