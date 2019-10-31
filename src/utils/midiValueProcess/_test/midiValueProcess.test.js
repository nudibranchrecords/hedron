import midiValueProcess, { getValue } from '../'
test('(Util) midiValueProcess - getValue() - absolute', () => {
  let midiValue, midiOptions, messageCount, actual, expected, nodeValue

  nodeValue = 0.5
  midiValue = 0.1
  midiOptions = {
    controlType: 'abs',
    sensitivity: 0.5,
  }
  messageCount = 1

  actual = getValue(nodeValue, midiValue, midiOptions, messageCount)
  expected = midiValue

  // Absolute mode ignores everything except the raw midiValue
  expect(actual).toBe(expected)

  nodeValue = 0.9
  midiValue = 0.5
  midiOptions = {
    controlType: 'abs',
    sensitivity: 0.2,
  }
  messageCount = 4

  actual = getValue(nodeValue, midiValue, midiOptions, messageCount)
  expected = midiValue

  // Absolute mode ignores everything except the raw midiValue
  expect(actual).toBe(expected)
})

test('(Util) midiValueProcess - getValue() - rel1', () => {
  let midiValue, midiOptions, messageCount, actual, expected, nodeValue

  nodeValue = 0.5
  midiValue = 1 // 127 is DOWN (rel1)
  midiOptions = {
    controlType: 'rel1',
    sensitivity: 0.5,
  }
  messageCount = 1

  actual = getValue(nodeValue, midiValue, midiOptions, messageCount)
  expected = 0.493

  // rel1 DOWN
  expect(actual).toBe(expected)

  nodeValue = 0.8
  midiValue = 1 // 1 is DOWN (rel1)
  midiOptions = {
    controlType: 'rel1',
    sensitivity: 0.1,
  }
  messageCount = 3

  actual = Math.round(getValue(nodeValue, midiValue, midiOptions, messageCount) * 10000) / 10000
  expected = 0.7958

  // rel1 DOWN
  expect(actual).toBe(expected)

  nodeValue = 0
  midiValue = 1 // 1 is DOWN (rel1)
  midiOptions = {
    controlType: 'rel1',
    sensitivity: 0.8,
  }
  messageCount = 3

  actual = Math.round(getValue(nodeValue, midiValue, midiOptions, messageCount) * 10000) / 10000
  expected = 0

  // rel1 DOWN (min 0)
  expect(actual).toBe(expected)

  nodeValue = 0.5
  midiValue = 0.1 // 1 is DOWN (rel1) - so this is UP
  midiOptions = {
    controlType: 'rel1',
    sensitivity: 0.6,
  }
  messageCount = 2

  actual = Math.round(getValue(nodeValue, midiValue, midiOptions, messageCount) * 10000) / 10000
  expected = 0.5168

  // rel1 UP
  expect(actual).toBe(expected)

  nodeValue = 1
  midiValue = 0.1 // 1 is DOWN (rel1) - so this is UP
  midiOptions = {
    controlType: 'rel1',
    sensitivity: 0.8,
  }
  messageCount = 5

  actual = Math.round(getValue(nodeValue, midiValue, midiOptions, messageCount) * 10000) / 10000
  expected = 1

  // rel1 UP (max 1)
  expect(actual).toBe(expected)
})

test('(Util) midiValueProcess - getValue() - rel2', () => {
  let midiValue, midiOptions, messageCount, actual, expected, nodeValue

  nodeValue = 0.5
  midiValue = 0.4960629921 // DOWN (rel2)
  midiOptions = {
    controlType: 'rel2',
    sensitivity: 0.5,
  }
  messageCount = 1

  actual = getValue(nodeValue, midiValue, midiOptions, messageCount)
  expected = 0.493

  // rel2 DOWN
  expect(actual).toBe(expected)
})

test('(Util) midiValueProcess - type is not select', () => {
  let node, midiValue, midiOptions, messageCount, actual, expected

  node = {
    value: 0.5,
    type: 'foo',
  }
  midiValue = 0.4960629921 // DOWN (rel2)
  midiOptions = {
    controlType: 'rel2',
    sensitivity: 0.5,
  }
  messageCount = 1

  actual = midiValueProcess({ node, value: midiValue, options: midiOptions, messageCount })
  expected = getValue(node.value, midiValue, midiOptions, messageCount)

  // uses getValue()
  expect(actual).toBe(expected)
})

test('(Util) midiValueProcess - type is select, controlType abs', () => {
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
