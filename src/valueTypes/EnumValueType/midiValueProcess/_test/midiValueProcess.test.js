import midiValueProcess from '../'
test('midiValueProcess - enum - controlType abs', () => {
  let node, midiValue, midiOptions, messageCount, actual, expected

  node = {
    value: 'five',
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

test('midiValueProcess - enum - controlType rel1', () => {
  let node, midiValue, midiOptions, messageCount, actual, expected

  node = {
    value: 'five',
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

test('midiValueProcess - enum - messageType is noteOn', () => {
  let node, midiValue, midiOptions, actual, expected

  node = {
    value: 'eight',
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

  midiValue = 127
  midiOptions = {
    messageType: 'noteOn',
  }

  actual = midiValueProcess({ node, value: midiValue, options: midiOptions })
  expected = 'nine'

  // Increments to next option
  expect(actual).toBe(expected)

  node.value = 'nine'
  actual = midiValueProcess({ node, value: midiValue, options: midiOptions })
  expected = 'ten'

  // Increments to next option
  expect(actual).toBe(expected)

  node.value = 'ten'
  actual = midiValueProcess({ node, value: midiValue, options: midiOptions })
  expected = 'one'

  // Wraps to first option
  expect(actual).toBe(expected)
})
