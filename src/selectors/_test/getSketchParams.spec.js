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
      },
      '05': {
        title: 'Speed Z',
        key: 'speedZ',
        value: 0.5
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
      },
      'zzz': {
        moduleId: 'sketch_3',
        module: 'test',
        title: 'Dollor Sketch',
        paramIds: ['05']
      }
    },
    scenes: {
      items: {
        'aaa': {
          sketchIds: ['xxx', 'yyy']
        }
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
    },
    sketch_3: {
      speedZ: 0.5
    }
  }

  actual = getSketchParams(state)

  t.deepEqual(actual, expected,
      'Returns key:value params for all sketches if no id given')

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

  actual = getSketchParams(state, null, 'aaa')

  t.deepEqual(actual, expected,
          'Returns key:value params for all sketches if scene ID given')

  t.end()
})

test('(engine) getSketchParams (min/max)', function (t) {
  const state = {
    nodes: {
      '06': {
        title: 'Foo',
        key: 'foo',
        value: 0.5,
        min: 0,
        max: 100
      },
      '07': {
        title: 'Bar',
        key: 'bar',
        value: 0.5,
        min: -100,
        max: 0
      },
      '08': {
        title: 'Lorem',
        key: 'lorem',
        value: 0.9,
        min: 10,
        max: 20
      }
    },
    sketches: {
      '@@@': {
        moduleId: 'sketch_4',
        module: 'minmax',
        title: 'Min Max',
        paramIds: ['06', '07', '08']
      }
    }
  }
  deepFreeze(state)

  let expected, actual

  expected = {
    foo: 50,
    bar: -50,
    lorem: 19
  }

  actual = getSketchParams(state, '@@@')

  t.deepEqual(actual, expected,
          'Returns correct value based on min/max')
  t.end()
})
