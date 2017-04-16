import test from 'tape'
import deepFreeze from 'deep-freeze'
import shotsReducer from '../reducer'
import { returnsPreviousState } from '../../../testUtils'

returnsPreviousState(shotsReducer)

test('(Reducer) shotsReducer - Adds shot on SHOT_CREATE', (t) => {
  let originalState, expectedState, actualState

  originalState = {}

  expectedState = {
    '01': {
      title: 'Meow',
      method: 'meow',
      sketchId: 'XXX'
    }
  }

  actualState = shotsReducer(originalState, {
    type: 'SHOT_CREATE',
    payload: {
      id: '01',
      shot: {
        title: 'Meow',
        method: 'meow',
        sketchId: 'XXX'
      }
    }
  })

  t.deepEqual(actualState, expectedState)

  expectedState = {
    '01': {
      title: 'Meow',
      method: 'meow',
      sketchId: 'XXX'
    },
    '02': {
      title: 'Woof',
      method: 'woof',
      sketchId: 'YYY'
    }
  }

  actualState = shotsReducer(actualState, {
    type: 'SHOT_CREATE',
    payload: {
      id: '02',
      shot: {
        title: 'Woof',
        method: 'woof',
        sketchId: 'YYY'
      }
    }
  })

  t.deepEqual(actualState, expectedState)

  t.end()
})

test('(Reducer) shotsReducer - Removes shot on SHOT_DELETE', (t) => {
  let originalState, expectedState, actualState

  originalState = {
    '01': {
      title: 'Meow',
      method: 'meow',
      sketchId: 'XXX'
    },
    '02': {
      title: 'Woof',
      method: 'woof',
      sketchId: 'YYY'
    }
  }

  expectedState = {
    '01': {
      title: 'Meow',
      method: 'meow',
      sketchId: 'XXX'
    }
  }

  actualState = shotsReducer(originalState, {
    type: 'SHOT_DELETE',
    payload: {
      id: '02'
    }
  })

  t.deepEqual(actualState, expectedState)

  expectedState = {}

  actualState = shotsReducer(actualState, {
    type: 'SHOT_DELETE',
    payload: {
      id: '01'
    }
  })

  t.deepEqual(actualState, expectedState)

  t.end()
})

test('(Reducer) shotsReducer - Replaces shots on SHOTS_REPLACE_ALL', (t) => {
  let originalState, actual

  const newShots = {
    'AA': {
      title: 'Ribbit',
      method: 'ribbit',
      sketchId: '111'
    },
    'BB': {
      title: 'Hello',
      method: 'hello',
      sketchId: '222'
    }
  }

  originalState = {
    '01': {
      title: 'Meow',
      method: 'meow',
      sketchId: 'XXX'
    },
    '02': {
      title: 'Woof',
      method: 'woof',
      sketchId: 'YYY'
    }
  }

  deepFreeze(originalState)

  actual = shotsReducer(originalState, {
    type: 'SHOTS_REPLACE_ALL',
    payload: {
      shots: newShots
    }
  })

  t.deepEqual(actual, newShots, 'Replaces all shots')

  t.end()
})
