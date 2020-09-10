import deepFreeze from 'deep-freeze'
import getSketchParams from '../getSketchParams'

jest.mock('../../valueTypes/FloatValueType/container', () => null)
jest.mock('../../valueTypes/BooleanValueType/container', () => null)
jest.mock('../../valueTypes/EnumValueType/container', () => null)

test('(engine) getSketchParams', function () {
  let actual, expected

  const state = {
    nodes: {
      '01': {
        title: 'Rotation X',
        key: 'rotX',
        value: 0.1,
        valueType: 'float',
      },
      '02': {
        title: 'Rotation Y',
        key: 'rotY',
        value: 0.2,
        valueType: 'float',
      },
      '03': {
        title: 'Speed X',
        key: 'speedX',
        value: 0.3,
        valueType: 'float',
      },
      '04': {
        title: 'Speed Y',
        key: 'speedY',
        value: 0.4,
        valueType: 'float',
      },
      '05': {
        title: 'Speed Z',
        key: 'speedZ',
        value: 0.5,
        valueType: 'float',
      },
    },
    sketches: {
      'xxx': {
        moduleId: 'sketch_1',
        module: 'test',
        title: 'Lorem Sketch',
        paramIds: ['01', '02'],
      },
      'yyy': {
        moduleId: 'sketch_2',
        module: 'test',
        title: 'Ipsum Sketch',
        paramIds: ['03', '04'],
      },
      'zzz': {
        moduleId: 'sketch_3',
        module: 'test',
        title: 'Dollor Sketch',
        paramIds: ['05'],
      },
    },
    scenes: {
      items: {
        'aaa': {
          sketchIds: ['xxx', 'yyy'],
        },
      },
    },
  }
  deepFreeze(state)

  expected = {
    rotX: 0.1,
    rotY: 0.2,
  }
  actual = getSketchParams(state, 'xxx')

  // Returns key:value params for single sketch
  expect(actual).toEqual(expected)

  expected = {
    speedX: 0.3,
    speedY: 0.4,
  }
  actual = getSketchParams(state, 'yyy')

  // Returns key:value params for single sketch
  expect(actual).toEqual(expected)

  expected = {
    sketch_1: {
      rotX: 0.1,
      rotY: 0.2,
    },
    sketch_2: {
      speedX: 0.3,
      speedY: 0.4,
    },
    sketch_3: {
      speedZ: 0.5,
    },
  }

  actual = getSketchParams(state)

  // Returns key:value params for all sketches if no id given
  expect(actual).toEqual(expected)

  expected = {
    sketch_1: {
      rotX: 0.1,
      rotY: 0.2,
    },
    sketch_2: {
      speedX: 0.3,
      speedY: 0.4,
    },
  }

  actual = getSketchParams(state, null, 'aaa')

  // Returns key:value params for all sketches if no id given
  expect(actual).toEqual(expected)
})

test('(engine) getSketchParams (min/max)', function () {
  const state = {
    nodes: {
      '06': {
        title: 'Foo',
        key: 'foo',
        value: 0.5,
        min: 0,
        max: 100,
        valueType: 'float',
      },
      '07': {
        title: 'Bar',
        key: 'bar',
        value: 0.5,
        min: -100,
        max: 0,
        valueType: 'float',
      },
      '08': {
        title: 'Lorem',
        key: 'lorem',
        value: 0.9,
        min: 10,
        max: 20,
        valueType: 'float',
      },
    },
    sketches: {
      '@@@': {
        moduleId: 'sketch_4',
        module: 'minmax',
        title: 'Min Max',
        paramIds: ['06', '07', '08'],
      },
    },
  }
  deepFreeze(state)

  let expected, actual

  expected = {
    foo: 50,
    bar: -50,
    lorem: 19,
  }

  actual = getSketchParams(state, '@@@')

  // Returns correct value based on min/max
  expect(actual).toEqual(expected)
})
