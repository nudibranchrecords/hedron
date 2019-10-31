import midiValueProcess from '../'
test('(Util) midiValueProcess - enum - controlType abs', () => {
  let node, midiValue, midiOptions, messageCount, actual, expected

  node = {
    value: 'five',
    type: 'select',
    options: [
      {
        value: 'one',
      },
      {
        value: 'two',
      },
      {
        value: 'three',
      },
      {
        value: 'four',
      },
      {
        value: 'five',
      },
      {
        value: 'six',
      },
      {
        value: 'seven',
      },
      {
        value: 'eight',
      },
      {
        value: 'nine',
      },
      {
        value: 'ten',
      },
    ],
  }

  midiValue = 0.05
  midiOptions = {
    controlType: 'abs',
    sensitivity: 0.5,
  }
  messageCount = 5

  actual = midiValueProcess({ node, value: midiValue, options: midiOptions, messageCount })
  expected = 'one'

  // Returns correct value from option
  expect(actual).toBe(expected)

  midiValue = 0.65
  midiOptions = {
    controlType: 'abs',
    sensitivity: 0.5,
  }
  messageCount = 2

  actual = midiValueProcess({ node, value: midiValue, options: midiOptions, messageCount })
  expected = 'seven'

  // Returns correct value from option
  expect(actual).toBe(expected)
})

test('(Util) midiValueProcess - type is select, controlType rel1', () => {
  let node, midiValue, midiOptions, messageCount, actual, expected

  node = {
    value: 'five',
    type: 'select',
    options: [
      {
        value: 'one',
      },
      {
        value: 'two',
      },
      {
        value: 'three',
      },
      {
        value: 'four',
      },
      {
        value: 'five',
      },
      {
        value: 'six',
      },
      {
        value: 'seven',
      },
      {
        value: 'eight',
      },
      {
        value: 'nine',
      },
      {
        value: 'ten',
      },
    ],
  }

  midiValue = 1 // DOWN
  midiOptions = {
    controlType: 'rel1',
    sensitivity: 0.5,
  }
  messageCount = 1

  actual = midiValueProcess({ node, value: midiValue, options: midiOptions, messageCount })
  expected = 'four'

  // Returns correct value from option, ignores messageCount
  expect(actual).toBe(expected)

  midiValue = 0.5 // UP
  midiOptions = {
    controlType: 'rel1',
    sensitivity: 0.5,
  }
  messageCount = 1

  actual = midiValueProcess({ node, value: midiValue, options: midiOptions, messageCount })
  expected = 'six'

  // Returns correct value from option, ignores messageCount
  expect(actual).toBe(expected)

  // Changing node value to lowest
  node.value = 'one'

  midiValue = 1 // DOWN
  midiOptions = {
    controlType: 'rel1',
    sensitivity: 0.5,
  }
  messageCount = 1

  actual = midiValueProcess({ node, value: midiValue, options: midiOptions, messageCount })
  expected = 'one'

  // Stays at lowest after decrease message
  expect(actual).toBe(expected)

  // Changing node value to lowest
  node.value = 'ten'

  midiValue = 0.5 // UP
  midiOptions = {
    controlType: 'rel1',
    sensitivity: 0.5,
  }
  messageCount = 1

  actual = midiValueProcess({ node, value: midiValue, options: midiOptions, messageCount })
  expected = 'ten'

  // Stays at highest after increase message
  expect(actual).toBe(expected)
})
