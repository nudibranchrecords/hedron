const { processMidiData } = require('../')

test('Returns correct value as a number between 0 and 1', () => {
  let data, expected, actual

  data = [0, 0, 127]

  expected = 1
  actual = processMidiData(data).value

  expect(actual).toBe(expected)

  data = [0, 0, 0]

  expected = 0
  actual = processMidiData(data).value

  expect(actual).toBe(expected)
})

test('Returns correct type', () => {
  let data, expected, actual

  data = [176, 0, 0]

  expected = 'controlChange'
  actual = processMidiData(data).messageType

  expect(actual).toBe(expected)

  data = [180, 0, 0]

  expected = 'controlChange'
  actual = processMidiData(data).messageType

  expect(actual).toBe(expected)

  data = [144, 0, 1]

  expected = 'noteOn'
  actual = processMidiData(data).messageType

  data = [147, 0, 1]

  expected = 'noteOn'
  actual = processMidiData(data).messageType

  expect(actual).toBe(expected)

  data = [144, 0, 0] // If last value is 0, it becomes a noteOf

  expected = 'noteOff'
  actual = processMidiData(data).messageType

  expect(actual).toBe(expected)

  data = [128, 0, 1]

  expected = 'noteOff'
  actual = processMidiData(data).messageType

  expect(actual).toBe(expected)

  data = [248, 0, 1]

  expected = 'timingClock'
  actual = processMidiData(data).messageType

  expect(actual).toBe(expected)
})

test('Returns id as a concatination of the first two vals', () => {
  let data, expected, actual

  data = [176, 100, 0]

  expected = 'midi_176_100'
  actual = processMidiData(data).id

  expect(actual).toBe(expected)

  data = [88, 0, 0]

  expected = 'midi_88_0'
  actual = processMidiData(data).id

  data = [8, 80, 0]

  expected = 'midi_8_80'
  actual = processMidiData(data).id

  expect(actual).toBe(expected)
})

test('Returns channel', () => {
  let data, expected, actual

  data = [176, 100, 0]

  expected = 0
  actual = processMidiData(data).channel

  expect(actual).toBe(expected)

  data = [186, 100, 0]

  expected = 10
  actual = processMidiData(data).channel

  expect(actual).toBe(expected)
})

test('Returns correct channel and id if forcedChannel arg is set', () => {
  let data, actual

  // incoming: channel 0
  data = [176, 100, 0]

  actual = processMidiData(data, 10)

  expect(actual.channel).toBe(10)
  expect(actual.id).toBe('midi_186_100')

  // incoming: channel 10
  data = [186, 100, 0]

  actual = processMidiData(data, 0)

  expect(actual.channel).toBe(0)
  expect(actual.id).toBe('midi_176_100')

  // incoming: channel 10
  data = [186, 100, 0]

  actual = processMidiData(data, false)

  expect(actual.channel).toBe(10)
  expect(actual.id).toBe('midi_186_100')
})

test('Doesnt get confused by non channel messages such as timing clock', () => {
  let data, actual

  // incoming: timing clock
  data = [248]
  actual = processMidiData(data, false)

  expect(actual.channel).toBeUndefined()
  expect(actual.id).toBeUndefined()

  // incoming: timing clock
  data = [248]
  actual = processMidiData(data, 10)

  expect(actual.channel).toBeUndefined()
  expect(actual.id).toBeUndefined()

  // incoming: start
  data = [250]
  actual = processMidiData(data, false)

  expect(actual.channel).toBeUndefined()
  expect(actual.id).toBeUndefined()

  // incoming: start
  data = [250]
  actual = processMidiData(data, 10)

  expect(actual.channel).toBeUndefined()
  expect(actual.id).toBeUndefined()
})
