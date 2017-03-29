import { expect } from 'chai'

import paramsReducer from '../params'
import deepFreeze from 'deep-freeze'

const fakeState = () => {
  return {
    valuesById: {
      '01': 1,
      '02': 0.5
    },
    info: {
      '01': {
        title: 'Rotation X',
        key: 'rotX'
      },
      '02': {
        title: 'Rotation Y',
        key: 'rotY'
      }
    }
  }
}

describe('(Reducer) paramsReducer', () => {
  it('Returns the previous state if an action was not matched.', () => {
    const expectedState = fakeState()

    deepFreeze(expectedState)
    let actualState = paramsReducer(expectedState, {})
    expect(actualState).to.deep.equal(expectedState)
    actualState = paramsReducer(actualState, { type: '@@@@@@@' })
    expect(actualState).to.deep.equal(expectedState)
  })

  it('Updates valuesById on PARAM_VALUE_UPDATE', () => {
    const originalState = fakeState()
    const expectedState = fakeState()
    expectedState.valuesById['01'] = 0.2

    deepFreeze(originalState)

    const actualState = paramsReducer(originalState, {
      type: 'PARAM_VALUE_UPDATE',
      payload: {
        paramId: '01',
        value: 0.2
      }
    })

    expect(actualState).to.deep.equal(expectedState)
  })
})
