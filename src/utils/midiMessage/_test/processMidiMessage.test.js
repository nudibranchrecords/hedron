const { processMidiMessage } = require('../')

test('Returns correct value as a number between 0 and 1', () => {
  let message, expected, actual

  message = {
    data: [0, 0, 127],
  }

  expected = 1
  actual = processMidiMessage(message).value

  expect(actual).toBe(expected)

  message = {
    data: [0, 0, 0],
  }

  expected = 0
  actual = processMidiMessage(message).value

  expect(actual).toBe(expected)
})

test('Returns correct type', () => {
  let message, expected, actual

  message = {
    data: [176, 0, 0],
  }

  expected = 'controlChange'
  actual = processMidiMessage(message).type

  expect(actual).toBe(expected)

  message = {
    data: [180, 0, 0],
  }

  expected = 'controlChange'
  actual = processMidiMessage(message).type

  expect(actual).toBe(expected)

  message = {
    data: [144, 0, 1],
  }

  expected = 'noteOn'
  actual = processMidiMessage(message).type

  message = {
    data: [147, 0, 1],
  }

  expected = 'noteOn'
  actual = processMidiMessage(message).type

  expect(actual).toBe(expected)

  message = {
    data: [144, 0, 0], // If last value is 0, it becomes a noteOff
  }

  expected = 'noteOff'
  actual = processMidiMessage(message).type

  expect(actual).toBe(expected)

  message = {
    data: [128, 0, 1],
  }

  expected = 'noteOff'
  actual = processMidiMessage(message).type

  expect(actual).toBe(expected)

  message = {
    data: [248, 0, 1],
  }

  expected = 'timingClock'
  actual = processMidiMessage(message).type

  expect(actual).toBe(expected)
})

test('Returns id as a concatination of the first two vals', () => {
  let message, expected, actual

  message = {
    data: [176, 100, 0],
  }

  expected = 'midi_176_100'
  actual = processMidiMessage(message).id

  expect(actual).toBe(expected)

  message = {
    data: [88, 0, 0],
  }

  expected = 'midi_88_0'
  actual = processMidiMessage(message).id

  message = {
    data: [8, 80, 0],
  }

  expected = 'midi_8_80'
  actual = processMidiMessage(message).id

  expect(actual).toBe(expected)
})
