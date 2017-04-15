import { call, select, takeEvery, put } from 'redux-saga/effects'
import { getModule, getSketchParamIds } from './selectors'
import { sketchCreate, sketchDelete } from '../sketches/actions'
import { paramCreate, paramDelete } from '../params/actions'
import uid from 'uid'

export function* handleSketchCreate (action) {
  let uniqueId
  const moduleId = action.payload.moduleId
  const module = yield select(getModule, moduleId)
  const paramIds = []

  for (let i = 0; i < module.params.length; i++) {
    const param = module.params[i]
    uniqueId = yield call(uid)
    paramIds.push(uniqueId)
    yield put(paramCreate(uniqueId, {
      title: param.title,
      key: param.key,
      value: param.defaultValue,
      id: uniqueId
    }))
  }

  uniqueId = yield call(uid)
  yield put(sketchCreate(uniqueId, {
    title: module.defaultTitle,
    moduleId: moduleId,
    paramIds
  }))
}

export function* handleSketchDelete (action) {
  const id = action.payload.id
  const paramIds = yield select(getSketchParamIds, id)

  for (let i = 0; i < paramIds.length; i++) {
    yield put(paramDelete(paramIds[i]))
  }

  yield put(sketchDelete(id))
}

export function* watchScene () {
  yield takeEvery('SCENE_SKETCH_CREATE', handleSketchCreate)
  yield takeEvery('SCENE_SKETCH_DELETE', handleSketchDelete)
}

