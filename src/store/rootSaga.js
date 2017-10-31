import { fork } from 'redux-saga/effects'
import { watchSketches } from '../Engine/sagas'
import { watchProject } from './project/sagas'
import { watchNodes } from './nodes/sagas'
import { watchInputLinks } from './inputLinks/sagas'
import { watchScene } from './scene/sagas'
import { watchInputs } from './inputs/sagas'
import { watchClock } from './clock/sagas'
import { watchWindows } from './windows/sagas'

export default function* rootSaga () {
  yield [
    fork(watchProject),
    fork(watchScene),
    fork(watchSketches),
    fork(watchInputs),
    fork(watchInputLinks),
    fork(watchNodes),
    fork(watchClock),
    fork(watchWindows)
  ]
}
