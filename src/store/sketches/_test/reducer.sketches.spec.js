import test from 'tape'
import deepFreeze from 'deep-freeze'
import proxyquire from 'proxyquire'

let u = 0

const sketchesReducer = proxyquire('../reducer', {
  'uid': () => `UID${u++}`
}).default

import { returnsPreviousState } from '../../../testUtils'

returnsPreviousState(sketchesReducer)

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

test('(Reducer) sketchesReducer - Adds new sketch on SKETCHES_CREATE_INSTANCE', (t) => {
  const originalState = {
    params: {
      p01: {
        key: 'rotX',
        title: 'Rotation X',
        value: 0.1
      },
      p02: {
        key: 'rotY',
        title: 'Rotation Y',
        value: 0.2
      }
    },
    modules: {
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
    },
    instances: {
      s01: {
        moduleId: 'cubey',
        title: 'Cubey 1',
        paramIds: ['p01', 'p02']
      }
    }
  }

  deepFreeze(originalState)

  const expectedInstances = {
    s01: {
      moduleId: 'cubey',
      title: 'Cubey 1',
      paramIds: ['p01', 'p02']
    },
    UID0: {
      moduleId: 'swirly',
      title: 'Swirly',
      paramIds: ['UID1', 'UID2']
    }
  }

  const expectedParams = {
    p01: {
      key: 'rotX',
      title: 'Rotation X',
      value: 0.1
    },
    p02: {
      key: 'rotY',
      title: 'Rotation Y',
      value: 0.2
    },
    UID1: {
      key: 'swirlRate',
      title: 'Swirl Rate',
      value: 0.1
    },
    UID2: {
      key: 'scale',
      title: 'Scale',
      value: 0.1
    }
  }

  const actual = sketchesReducer(originalState, {
    type: 'SKETCHES_CREATE_INSTANCE',
    payload: {
      moduleId: 'swirly'
    }
  })

  t.deepEqual(actual.instances, expectedInstances, 'Adds new instance item')
  t.deepEqual(actual.params, expectedParams, 'Adds new instance item')
  t.end()
})
