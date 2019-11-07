import { getMidiValue } from '../'
test('(Util) midiValueProcess - getMidiValue() - absolute', () => {
  let midiValue, midiOptions, messageCount, actual, expected, nodeValue

  nodeValue = 0.5
  midiValue = 0.1
  midiOptions = {
    controlType: 'abs',
    sensitivity: 0.5,
  }
  messageCount = 1

  actual = getMidiValue(nodeValue, midiValue, midiOptions, messageCount)
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

  actual = getMidiValue(nodeValue, midiValue, midiOptions, messageCount)
  expected = midiValue

  // Absolute mode ignores everything except the raw midiValue
  expect(actual).toBe(expected)
})

test('(Util) midiValueProcess - getMidiValue() - rel1', () => {
  let midiValue, midiOptions, messageCount, actual, expected, nodeValue

  nodeValue = 0.5
  midiValue = 1 // 127 is DOWN (rel1)
  midiOptions = {
    controlType: 'rel1',
    sensitivity: 0.5,
  }
  messageCount = 1

  actual = getMidiValue(nodeValue, midiValue, midiOptions, messageCount)
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

  actual = Math.round(getMidiValue(nodeValue, midiValue, midiOptions, messageCount) * 10000) / 10000
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

  actual = Math.round(getMidiValue(nodeValue, midiValue, midiOptions, messageCount) * 10000) / 10000
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

  actual = Math.round(getMidiValue(nodeValue, midiValue, midiOptions, messageCount) * 10000) / 10000
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

  actual = Math.round(getMidiValue(nodeValue, midiValue, midiOptions, messageCount) * 10000) / 10000
  expected = 1

  // rel1 UP (max 1)
  expect(actual).toBe(expected)
})

test('(Util) midiValueProcess - getMidiValue() - rel2', () => {
  let midiValue, midiOptions, messageCount, actual, expected, nodeValue

  nodeValue = 0.5
  midiValue = 0.4960629921 // DOWN (rel2)
  midiOptions = {
    controlType: 'rel2',
    sensitivity: 0.5,
  }
  messageCount = 1

  actual = getMidiValue(nodeValue, midiValue, midiOptions, messageCount)
  expected = 0.493

  // rel2 DOWN
  expect(actual).toBe(expected)
})
