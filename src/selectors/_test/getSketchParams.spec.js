import test from 'tape'
import deepFreeze from 'deep-freeze'
import getSketchParams from '../getSketchParams'

test('(engine) getSketchParams', function (t) {
  let actual, expected

  const state = {
    nodes: {
      '01': {
        title: 'Rotation X',
        key: 'rotX',
        value: 0.1
      },
      '02': {
        title: 'Rotation Y',
        key: 'rotY',
        value: 0.2
      },
      '03': {
        title: 'Speed X',
        key: 'speedX',
        value: 0.3
      },
      '04': {
        title: 'Speed Y',
        key: 'speedY',
        value: 0.4
      }
    },
    sketches: {
      'xxx': {
        moduleId: 'sketch_1',
        module: 'test',
        title: 'Lorem Sketch',
        paramIds: ['01', '02']
      },
      'yyy': {
        moduleId: 'sketch_2',
        module: 'test',
        title: 'Ipsum Sketch',
        paramIds: ['03', '04']
      }
    }
  }
  deepFreeze(state)

  expected = {
    rotX: 0.1,
    rotY: 0.2
  }
  actual = getSketchParams(state, 'xxx')

  t.deepEqual(actual, expected,
    'Returns key:value params for single sketch')

  expected = {
    speedX: 0.3,
    speedY: 0.4
  }
  actual = getSketchParams(state, 'yyy')

  t.deepEqual(actual, expected,
    'Returns key:value params for single sketch')

  expected = {
    sketch_1: {
      rotX: 0.1,
      rotY: 0.2
    },
    sketch_2: {
      speedX: 0.3,
      speedY: 0.4
    }
  }

  actual = getSketchParams(state)

  t.deepEqual(actual, expected,
      'Returns key:value params for all sketches if no id given')
  t.end()
})
