import test from 'tape'
import deepFreeze from 'deep-freeze'
import sketchesReducer from '../reducer'

test('(Reducer) sketchesReducer - Adds new sketch on SKETCHES_MODULES_UPDATE', (t) => {
  const originalState = {
    params: {},
    instances: {},
    modules: {}
  }

  deepFreeze(originalState)

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

  const actual = sketchesReducer(originalState, {
    type: 'SKETCHES_MODULES_UPDATE',
    payload: {
      modules
    }
  })

  t.deepEqual(actual.modules, modules)
  t.end()
})
