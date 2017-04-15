import { fork } from 'redux-saga/effects'
import { watchSketches } from '../Engine/sagas'
import { watchProject } from './project/sagas'
import { watchScene } from './scene/sagas'
import { watchWindows } from './windows/sagas'
import { watchInputs } from './inputs/sagas'

export default function* rootSaga () {
  yield [
    fork(watchWindows),
    fork(watchProject),
    fork(watchScene),
    fork(watchSketches),
    fork(watchInputs)
  ]
}
