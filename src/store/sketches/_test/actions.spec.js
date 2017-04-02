import test from 'tape'
import * as a from '../actions'

test('(Action Creator) sketchesCreateInstance', (t) => {
  let actual = a.sketchesCreateInstance('cubeSpinner')
  let expected = {
    type: 'SKETCHES_CREATE_INSTANCE',
    payload: {
      moduleId: 'cubeSpinner'
    }
  }
  t.deepEqual(actual, expected, 'Creates action to add a sketch')
  t.end()
})

test('(Action Creator) sketchesParamValueUpdate', (t) => {
  let actual = a.sketchesParamValueUpdate('01', 0.5)
  let expected = {
    type: 'SKETCHES_PARAM_VALUE_UPDATE',
    payload: {
      id: '01',
      value: 0.5
    }
  }
  t.deepEqual(actual, expected, 'Creates action to update param')
  t.end()
})

test('(Action Creator) sketchesModulesUpdate', (t) => {
  const modules = {
    cubey: {
      defaultTitle: 'Cubey',
      params: [
        {
          key: 'rotX',
          title: 'Rotation X',
          defaultValue: 0.5
        },
        {
          key: 'rotY',
          title: 'Rotation Y',
          defaultValue: 0.5
        }
      ]
    },
    swirly: {
      defaultTitle: 'Swirly',
      params: [
        {
          key: 'swirlRate',
          title: 'Swirl Rate',
          defaultValue: 0.1
        },
        {
          key: 'scale',
          title: 'Scale',
          defaultValue: 0.1
        }
      ]
    }
  }
  let actual = a.sketchesModulesUpdate(modules)
  let expected = {
    type: 'SKETCHES_MODULES_UPDATE',
    payload: {
      modules
    }
  }
  t.deepEqual(actual, expected, 'Creates action to update available modules')
  t.end()
})
