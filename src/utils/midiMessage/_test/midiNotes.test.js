const { midiNotes } = require('../')

test('Returns text for midi note', () => {
  let expected, actual

  expected = '0 - C (-1)'
  actual = midiNotes[0]

  expect(actual).toBe(expected)

  expected = '27 - D# (1)'
  actual = midiNotes[27]

  expect(actual).toBe(expected)

  expected = '60 - C (4)'
  actual = midiNotes[60]

  expect(actual).toBe(expected)
})
