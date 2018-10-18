import test from 'tape'
import midiValueProcess, { getValue } from '../'

test('(Util) midiValueProcess - getValue() - absolute', (t) => {
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

  t.equal(actual, expected, 'Absolute mode ignores everything except the raw midiValue')

  nodeValue = 0.9
  midiValue = 0.5
  midiOptions = {
    controlType: 'abs',
    sensitivity: 0.2,
  }
  messageCount = 4

  actual = getValue(nodeValue, midiValue, midiOptions, messageCount)
  expected = midiValue

  t.equal(actual, expected, 'Absolute mode ignores everything except the raw midiValue')
  t.end()
})

test('(Util) midiValueProcess - getValue() - rel1', (t) => {
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

  t.equal(actual, expected, 'rel1 DOWN')

  nodeValue = 0.8
  midiValue = 1 // 1 is DOWN (rel1)
  midiOptions = {
    controlType: 'rel1',
    sensitivity: 0.1,
  }
  messageCount = 3

  actual = Math.round(getValue(nodeValue, midiValue, midiOptions, messageCount) * 10000) / 10000
  expected = 0.7958

  t.equal(actual, expected, 'rel1 DOWN')

  nodeValue = 0
  midiValue = 1 // 1 is DOWN (rel1)
  midiOptions = {
    controlType: 'rel1',
    sensitivity: 0.8,
  }
  messageCount = 3

  actual = Math.round(getValue(nodeValue, midiValue, midiOptions, messageCount) * 10000) / 10000
  expected = 0

  t.equal(actual, expected, 'rel1 DOWN (min 0)')

  nodeValue = 0.5
  midiValue = 0.1 // 1 is DOWN (rel1) - so this is UP
  midiOptions = {
    controlType: 'rel1',
    sensitivity: 0.6,
  }
  messageCount = 2

  actual = Math.round(getValue(nodeValue, midiValue, midiOptions, messageCount) * 10000) / 10000
  expected = 0.5168

  t.equal(actual, expected, 'rel1 UP')

  nodeValue = 1
  midiValue = 0.1 // 1 is DOWN (rel1) - so this is UP
  midiOptions = {
    controlType: 'rel1',
    sensitivity: 0.8,
  }
  messageCount = 5

  actual = Math.round(getValue(nodeValue, midiValue, midiOptions, messageCount) * 10000) / 10000
  expected = 1

  t.equal(actual, expected, 'rel1 UP (max 1)')

  t.end()
})

test('(Util) midiValueProcess - getValue() - rel2', (t) => {
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

  t.equal(actual, expected, 'rel2 DOWN')
  t.end()
})

test('(Util) midiValueProcess - type is not select', (t) => {
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

  actual = midiValueProcess(node, midiValue, midiOptions, messageCount)
  expected = getValue(node.value, midiValue, midiOptions, messageCount)

  t.equal(actual, expected, 'uses getValue()')
  t.end()
})

test('(Util) midiValueProcess - type is select, controlType abs', (t) => {
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

  actual = midiValueProcess(node, midiValue, midiOptions, messageCount)
  expected = 'one'

  t.equal(actual, expected, 'Returns correct value from option')

  midiValue = 0.65
  midiOptions = {
    controlType: 'abs',
    sensitivity: 0.5,
  }
  messageCount = 2

  actual = midiValueProcess(node, midiValue, midiOptions, messageCount)
  expected = 'seven'

  t.equal(actual, expected, 'Returns correct value from option')
  t.end()
})

test('(Util) midiValueProcess - type is select, controlType rel1', (t) => {
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

  actual = midiValueProcess(node, midiValue, midiOptions, messageCount)
  expected = 'four'

  t.equal(actual, expected, 'Returns correct value from option, ignores messageCount')

  midiValue = 0.5 // UP
  midiOptions = {
    controlType: 'rel1',
    sensitivity: 0.5,
  }
  messageCount = 1

  actual = midiValueProcess(node, midiValue, midiOptions, messageCount)
  expected = 'six'

  t.equal(actual, expected, 'Returns correct value from option, ignores messageCount')

  // Changing node value to lowest
  node.value = 'one'

  midiValue = 1 // DOWN
  midiOptions = {
    controlType: 'rel1',
    sensitivity: 0.5,
  }
  messageCount = 1

  actual = midiValueProcess(node, midiValue, midiOptions, messageCount)
  expected = 'one'

  t.equal(actual, expected, 'Stays at lowest after decrease message')

  // Changing node value to lowest
  node.value = 'ten'

  midiValue = 0.5 // UP
  midiOptions = {
    controlType: 'rel1',
    sensitivity: 0.5,
  }
  messageCount = 1

  actual = midiValueProcess(node, midiValue, midiOptions, messageCount)
  expected = 'ten'

  t.equal(actual, expected, 'Stays at highest after increase message')

  t.end()
})
