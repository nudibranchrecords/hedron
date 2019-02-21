const { processMidiId, processMidiData } = require('../')

test('Returns same as processMidiData. Params entered are split by _, last val always being 1', () => {
  let id, expected, actual

  id = 'midi_1_0'

  expected = processMidiData([1, 0, 1])
  actual = processMidiId(id)
  expect(actual).toEqual(expected)

  id = 'midi_0_1'

  expected = processMidiData([0, 1, 1])
  actual = processMidiId(id)
  expect(actual).toEqual(expected)

  id = 'midi_127_0'

  expected = processMidiData([127, 0, 1])
  actual = processMidiId(id)
  expect(actual).toEqual(expected)
})
