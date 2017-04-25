import { call, select, takeEvery, put } from 'redux-saga/effects'
import { getModule, getSketchParamIds, getSketchShotIds } from './selectors'
import { sketchCreate, sketchDelete } from '../sketches/actions'
import { uNodeCreate, uNodeDelete } from '../nodes/actions'
import { shotCreate, shotDelete } from '../shots/actions'
import uid from 'uid'

export function* handleSketchCreate (action) {
  let uniqueId
  const moduleId = action.payload.moduleId
  const uniqueSketchId = yield call(uid)
  const module = yield select(getModule, moduleId)
  const paramIds = []
  const shotIds = []

  for (let i = 0; i < module.params.length; i++) {
    const param = module.params[i]
    uniqueId = yield call(uid)
    paramIds.push(uniqueId)
    yield put(uNodeCreate(uniqueId, {
      title: param.title,
      key: param.key,
      value: param.defaultValue,
      id: uniqueId
    }))
  }

  for (let i = 0; i < module.shots.length; i++) {
    const shot = module.shots[i]
    uniqueId = yield call(uid)
    shotIds.push(uniqueId)
    yield put(shotCreate(uniqueId, {
      title: shot.title,
      method: shot.method,
      sketchId: uniqueSketchId
    }))
  }

  yield put(sketchCreate(uniqueSketchId, {
    title: module.defaultTitle,
    moduleId: moduleId,
    paramIds,
    shotIds
  }))
}

export function* handleSketchDelete (action) {
  const id = action.payload.id
  const paramIds = yield select(getSketchParamIds, id)

  for (let i = 0; i < paramIds.length; i++) {
    yield put(uNodeDelete(paramIds[i]))
  }

  const shotIds = yield select(getSketchShotIds, id)

  for (let i = 0; i < shotIds.length; i++) {
    yield put(shotDelete(shotIds[i]))
  }

  yield put(sketchDelete(id))
}

export function* watchScene () {
  yield takeEvery('SCENE_SKETCH_CREATE', handleSketchCreate)
  yield takeEvery('SCENE_SKETCH_DELETE', handleSketchDelete)
}

