import test from 'tape'
import deepFreeze from 'deep-freeze'
import proxyquire from 'proxyquire'

let u = 0

const sketchesReducer = proxyquire('../reducer', {
  'uid': () => `UID${u++}`
}).default

import { returnsPreviousState } from '../../../testUtils'

returnsPreviousState(sketchesReducer)

test('(Reducer) sketchesReducer - Adds new sketch on SKETCHES_INSTANCE_CREATE', (t) => {
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
    type: 'SKETCHES_INSTANCE_CREATE',
    payload: {
      moduleId: 'swirly'
    }
  })

  t.deepEqual(actual.instances, expectedInstances, 'Adds new instance item')
  t.deepEqual(actual.params, expectedParams, 'Adds related params')
  t.end()
})

test('(Reducer) sketchesReducer - Removes sketch on SKETCHES_INSTANCE_DELETE', (t) => {
  let originalState, expectedInstances, expectedParams, actual

  originalState = {
    params: {
      p01: 'something',
      p02: 'something',
      p03: 'something',
      p04: 'something'
    },
    modules: {},
    instances: {
      s01: {
        moduleId: 'cubey',
        title: 'Cubey 1',
        paramIds: ['p01', 'p02']
      },
      s02: {
        moduleId: 'swirly',
        title: 'Swirly 1',
        paramIds: ['p03', 'p04']
      }
    }
  }

  deepFreeze(originalState)

  expectedInstances = {
    s01: {
      moduleId: 'cubey',
      title: 'Cubey 1',
      paramIds: ['p01', 'p02']
    }
  }

  expectedParams = {
    p01: 'something',
    p02: 'something'
  }

  actual = sketchesReducer(originalState, {
    type: 'SKETCHES_INSTANCE_DELETE',
    payload: {
      id: 's02'
    }
  })

  t.deepEqual(actual.instances, expectedInstances, 'Removes instance item')
  t.deepEqual(actual.params, expectedParams, 'Removes related params')

  expectedParams = {}
  expectedInstances = {}

  actual = sketchesReducer(actual, {
    type: 'SKETCHES_INSTANCE_DELETE',
    payload: {
      id: 's01'
    }
  })

  t.deepEqual(actual.instances, expectedInstances, 'Removes instance item')
  t.deepEqual(actual.params, expectedParams, 'Removes related params')

  t.end()
})
