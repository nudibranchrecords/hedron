import { call, select, takeEvery, put } from 'redux-saga/effects'
import { getModule, getSketchParamIds, getSketchShotIds } from './selectors'
import { sketchCreate, sketchDelete, sketchUpdate } from '../sketches/actions'
import { uNodeCreate, uNodeDelete, nodeUpdate } from '../nodes/actions'
import getSketches from '../../selectors/getSketches'
import getSketch from '../../selectors/getSketch'
import getNode from '../../selectors/getNode'
import history from '../../history'
import uid from 'uid'

export function* handleSketchCreate (action) {
  let uniqueId
  const moduleId = action.payload.moduleId
  const uniqueSketchId = yield call(uid)
  const module = yield select(getModule, moduleId)
  const paramIds = []
  const inputLinkIds = []
  const shotIds = []

  if (module.params) {
    for (let i = 0; i < module.params.length; i++) {
      const param = module.params[i]

      uniqueId = yield call(uid)
      paramIds.push(uniqueId)
      yield put(uNodeCreate(uniqueId, {
        title: param.title,
        type: 'param',
        key: param.key,
        value: param.defaultValue,
        id: uniqueId,
        inputLinkIds
      }))
    }
  }

  if (module.shots) {
    for (let i = 0; i < module.shots.length; i++) {
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
        inputLinkIds
      }))
    }
  }

  yield put(sketchCreate(uniqueSketchId, {
    title: module.defaultTitle,
    moduleId: moduleId,
    paramIds,
    shotIds,
    openedNodes: {}
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
  let url
  if (lastId !== undefined) {
    url = '/sketches/view/' + lastId
  } else {
    url = '/sketches/add'
  }
  yield call([history, history.push], url)
}

export function* handleSketchReimport (action) {
  const id = action.payload.id
  const sketch = yield select(getSketch, id)
  const module = yield select(getModule, sketch.moduleId)
  let paramIds = sketch.paramIds
  let shotIds = sketch.shotIds
  const sketchParams = {}
  const sketchShots = {}

  for (let i = 0; i < paramIds.length; i++) {
    const param = yield select(getNode, paramIds[i])
    sketchParams[param.key] = param
  }

  for (let i = 0; i < shotIds.length; i++) {
    const shot = yield select(getNode, shotIds[i])
    sketchShots[shot.method] = shot
  }

  const moduleParams = module.params
  const moduleShots = module.shots

  // Look through the loaded module's params for new ones
  for (let i = 0; i < moduleParams.length; i++) {
    const moduleParam = moduleParams[i]
    const sketchParam = sketchParams[moduleParam.key]

    if (!sketchParam) {
      // If module param doesnt exist in sketch, it needs to be created
      const uniqueId = yield call(uid)
      paramIds = [
        ...paramIds.slice(0, i), uniqueId, ...paramIds.slice(i)
      ]
      yield put(uNodeCreate(uniqueId, {
        title: moduleParam.title,
        type: 'param',
        key: moduleParam.key,
        value: moduleParam.defaultValue,
        id: uniqueId,
        inputLinkIds: []
      }))
    } else {
      // If param does exist, the title may still change
      const id = sketchParam.id
      yield put(nodeUpdate(id, { title: moduleParam.title }))
    }
  }

  // Look through the loaded module's shots for new ones
  for (let i = 0; i < moduleShots.length; i++) {
    const moduleShot = moduleShots[i]
    const sketchShot = sketchShots[moduleShot.method]

    if (!sketchShot) {
      // If module shot doesnt exist in sketch, it needs to be created
      const uniqueId = yield call(uid)
      shotIds = [
        ...shotIds.slice(0, i), uniqueId, ...shotIds.slice(i)
      ]
      yield put(uNodeCreate(uniqueId, {
        id: uniqueId,
        value: 0,
        type: 'shot',
        title: moduleShot.title,
        method: moduleShot.method,
        sketchId: id,
        inputLinkIds: []
      }))
    } else {
      // If param does exist, the title may still change
      const id = sketchShot.id
      yield put(nodeUpdate(id, { title: sketchShot.title }))
    }
  }

  yield put(sketchUpdate(id, { paramIds, shotIds }))
}

export function* watchScene () {
  yield takeEvery('SCENE_SKETCH_CREATE', handleSketchCreate)
  yield takeEvery('SCENE_SKETCH_DELETE', handleSketchDelete)
  yield takeEvery('SCENE_SKETCH_REIMPORT', handleSketchReimport)
}
