import test from 'tape'
import * as a from '../actions'

test('(Action Creator) availableModulesReplaceAll', (t) => {
  const modules = {
    cubey: {
      defaultTitle: 'Cubey',
      params: [
        {
          key: 'rotX',
          title: 'Rotation X',
          defaultValue: 0.5,
        },
        {
          key: 'rotY',
          title: 'Rotation Y',
          defaultValue: 0.5,
        },
      ],
    },
    swirly: {
      defaultTitle: 'Swirly',
      params: [
        {
          key: 'swirlRate',
          title: 'Swirl Rate',
          defaultValue: 0.1,
        },
        {
          key: 'scale',
          title: 'Scale',
          defaultValue: 0.1,
        },
      ],
    },
  }
  let actual = a.availableModulesReplaceAll(modules)
  let expected = {
    type: 'AVAILABLE_MODULES_REPLACE_ALL',
    payload: {
      modules,
    },
  }
  t.deepEqual(actual, expected, 'Creates action to update available modules')
  t.end()
})
