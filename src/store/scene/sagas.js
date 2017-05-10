import { call, select, takeEvery, put } from 'redux-saga/effects'
import { getModule, getSketchParamIds, getSketchShotIds } from './selectors'
import { sketchCreate, sketchDelete } from '../sketches/actions'
import { uNodeCreate, uNodeDelete } from '../nodes/actions'
import getSketches from '../../selectors/getSketches'
import lfoGenerateOptions from '../../utils/lfoGenerateOptions'
import history from '../../history'
import uid from 'uid'

export function* handleSketchCreate (action) {
  let uniqueId
  const moduleId = action.payload.moduleId
  const uniqueSketchId = yield call(uid)
  const module = yield select(getModule, moduleId)
  const paramIds = []
  const shotIds = []

  if (module.params) {
    for (let i = 0; i < module.params.length; i++) {
      const param = module.params[i]

      const lfoOpts = yield call(lfoGenerateOptions)
      const lfoOptionIds = []

      for (let key in lfoOpts) {
        const item = lfoOpts[key]
        lfoOptionIds.push(item.id)

        yield put(uNodeCreate(item.id, item))
      }

      uniqueId = yield call(uid)
      paramIds.push(uniqueId)
      yield put(uNodeCreate(uniqueId, {
        title: param.title,
        key: param.key,
        value: param.defaultValue,
        id: uniqueId,
        lfoOptionIds,
        isOpen: false
      }))
    }
  }

  if (module.shots) {
    for (let i = 0; i < module.shots.length; i++) {
      const lfoOpts = yield call(lfoGenerateOptions)
      const lfoOptionIds = []

      for (let key in lfoOpts) {
        const item = lfoOpts[key]
        lfoOptionIds.push(item.id)

        yield put(uNodeCreate(item.id, item))
      }

      const shot = module.shots[i]
      uniqueId = yield call(uid)
      shotIds.push(uniqueId)
      yield put(uNodeCreate(uniqueId, {
        id: uniqueId,
        value: 0,
        type: 'shot',
        title: shot.title,
        method: shot.method,
        sketchId: uniqueSketchId,
        lfoOptionIds
      }))
    }
  }

  yield put(sketchCreate(uniqueSketchId, {
    title: module.defaultTitle,
    moduleId: moduleId,
    paramIds,
    shotIds
  }))

  yield call([history, history.push], '/sketches/view/' + uniqueSketchId)
}

export function* handleSketchDelete (action) {
  const id = action.payload.id
  const paramIds = yield select(getSketchParamIds, id)

  for (let i = 0; i < paramIds.length; i++) {
    yield put(uNodeDelete(paramIds[i]))
  }

  const shotIds = yield select(getSketchShotIds, id)

  for (let i = 0; i < shotIds.length; i++) {
    yield put(uNodeDelete(shotIds[i]))
  }

  yield put(sketchDelete(id))

  const sketches = yield select(getSketches)
  const sketchKeys = Object.keys(sketches)
  const lastId = sketchKeys[sketchKeys.length - 1]
  yield call([history, history.push], '/sketches/view/' + lastId)
}

export function* watchScene () {
  yield takeEvery('SCENE_SKETCH_CREATE', handleSketchCreate)
  yield takeEvery('SCENE_SKETCH_DELETE', handleSketchDelete)
}

