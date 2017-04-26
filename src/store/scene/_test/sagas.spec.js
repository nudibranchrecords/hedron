import 'babel-polyfill'
import test from 'tape'
import { call, select, takeEvery, put } from 'redux-saga/effects'
import { watchScene, handleSketchCreate, handleSketchDelete } from '../sagas'
import { getModule, getSketchParamIds, getSketchShotIds } from '../selectors'
import { sketchCreate, sketchDelete } from '../../sketches/actions'
import { uNodeCreate, uNodeDelete } from '../../nodes/actions'
import { shotCreate, shotDelete } from '../../shots/actions'
import lfoGenerateOptions from '../../../utils/lfoGenerateOptions'

import uid from 'uid'
// import { getProjectData, getProjectFilepath } from '../selectors'
// import { projectLoadSuccess } from '../actions'

test('(Saga) watchScene', (t) => {
  const generator = watchScene()
  t.deepEqual(
    generator.next().value,
    takeEvery('SCENE_SKETCH_CREATE', handleSketchCreate)
  )
  t.deepEqual(
    generator.next().value,
    takeEvery('SCENE_SKETCH_DELETE', handleSketchDelete)
  )
  t.end()
})

test('(Saga) handleSketchCreate', (t) => {
  let moduleObj, uniqueId, lfoOpts

  const generator = handleSketchCreate({
    payload: {
      moduleId: 'cubey'
    }
  })

  t.deepEqual(
    generator.next().value,
    call(uid),
    'Generate unique ID for sketch'
  )

  uniqueId = 'SKETCHID'

  t.deepEqual(
    generator.next(uniqueId).value,
    select(getModule, 'cubey'),
    'Get module object'
  )

  moduleObj = {
    defaultTitle: 'Cubey Boy',
    params: [
      {
        title: 'Rotate X',
        defaultValue: 0.1,
        key: 'RotX'
      },
      {
        title: 'Rotate Y',
        defaultValue: 0.5,
        key: 'RotY'
      }
    ],
    shots: [
      {
        title: 'Shapeshift',
        method: 'shapeshift'
      },
      {
        title: 'Explode',
        method: 'explode'
      }
    ]
  }

  t.deepEqual(
    generator.next(moduleObj).value,
    call(lfoGenerateOptions),
    'Generate options for LFO'
  )

  lfoOpts = [
    {
      id: 'LFO1',
      key: 'shape',
      value: 'sine'
    },
    {
      id: 'LFO2',
      key: 'rate',
      value: 1
    }
  ]

  t.deepEqual(
    generator.next(lfoOpts).value,
    put(uNodeCreate('LFO1', {
      key: 'shape',
      id: 'LFO1',
      value: 'sine'
    })),
    'Dispatch node create action'
  )

  t.deepEqual(
    generator.next().value,
    put(uNodeCreate('LFO2', {
      key: 'rate',
      id: 'LFO2',
      value: 1
    })),
    'Dispatch node create action'
  )

  t.deepEqual(
    generator.next(moduleObj).value,
    call(uid),
    'Generate unique ID for param'
  )

  uniqueId = 'PARAM1'

  t.deepEqual(
    generator.next(uniqueId).value,
    put(uNodeCreate(uniqueId, {
      title: 'Rotate X',
      key: 'RotX',
      id: uniqueId,
      value: 0.1,
      lfoOptionIds: ['LFO1', 'LFO2']
    })),
    'Dispatch node create action'
  )

  t.deepEqual(
    generator.next(moduleObj).value,
    call(lfoGenerateOptions),
    'Generate options for LFO'
  )

  lfoOpts = [
    {
      id: 'LFO3',
      key: 'shape',
      value: 'sine'
    },
    {
      id: 'LFO4',
      key: 'rate',
      value: 1
    }
  ]

  t.deepEqual(
    generator.next(lfoOpts).value,
    put(uNodeCreate('LFO3', {
      key: 'shape',
      id: 'LFO3',
      value: 'sine'
    })),
    'Dispatch node create action'
  )

  t.deepEqual(
    generator.next().value,
    put(uNodeCreate('LFO4', {
      key: 'rate',
      id: 'LFO4',
      value: 1
    })),
    'Dispatch node create action'
  )

  t.deepEqual(
    generator.next(moduleObj).value,
    call(uid),
    'Generate unique ID for param'
  )

  uniqueId = 'PARAM2'

  t.deepEqual(
    generator.next(uniqueId).value,
    put(uNodeCreate(uniqueId, {
      title: 'Rotate Y',
      key: 'RotY',
      id: uniqueId,
      value: 0.5,
      lfoOptionIds: ['LFO3', 'LFO4']
    })),
    'Dispatch node create action'
  )

  t.deepEqual(
    generator.next(moduleObj).value,
    call(uid),
    'Generate unique ID for shot'
  )

  uniqueId = 'SHOT1'

  t.deepEqual(
    generator.next(uniqueId).value,
    put(shotCreate(uniqueId, {
      title: 'Shapeshift',
      method: 'shapeshift',
      sketchId: 'SKETCHID'
    })),
    'Dispatch shot create action'
  )

  t.deepEqual(
    generator.next(moduleObj).value,
    call(uid),
    'Generate unique ID for shot'
  )

  uniqueId = 'SHOT2'

  t.deepEqual(
    generator.next(uniqueId).value,
    put(shotCreate(uniqueId, {
      title: 'Explode',
      method: 'explode',
      sketchId: 'SKETCHID'
    })),
    'Dispatch shot create action'
  )

  t.deepEqual(
    generator.next(uniqueId).value,
    put(sketchCreate('SKETCHID', {
      title: 'Cubey Boy',
      moduleId: 'cubey',
      paramIds: ['PARAM1', 'PARAM2'],
      shotIds: ['SHOT1', 'SHOT2']
    })),
    'Dispatch sketch create action'
  )

  t.equal(generator.next().done, true, 'Generator ends')

  t.end()
})

test('(Saga) handleSketchDelete', (t) => {
  const generator = handleSketchDelete({
    payload: {
      id: 'XXX'
    }
  })

  t.deepEqual(
    generator.next().value,
    select(getSketchParamIds, 'XXX'),
    'Get param Ids'
  )

  const paramIds = ['P1', 'P2']

  t.deepEqual(
    generator.next(paramIds).value,
    put(uNodeDelete('P1')),
    'Dispatch param delete action'
  )

  t.deepEqual(
    generator.next().value,
    put(uNodeDelete('P2')),
    'Dispatch param delete action'
  )

  t.deepEqual(
    generator.next().value,
    select(getSketchShotIds, 'XXX'),
    'Get shot Ids'
  )

  const shotIds = ['S1', 'S2']

  t.deepEqual(
    generator.next(shotIds).value,
    put(shotDelete('S1')),
    'Dispatch shot delete action'
  )

  t.deepEqual(
    generator.next().value,
    put(shotDelete('S2')),
    'Dispatch shot delete action'
  )

  t.deepEqual(
    generator.next().value,
    put(sketchDelete('XXX')),
    'Dispatch sketch delete action'
  )

  t.equal(generator.next().done, true, 'Generator ends')

  t.end()
})
