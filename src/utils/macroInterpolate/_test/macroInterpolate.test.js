import macroInterpolate from '..'

test('(Util) macroInterpolate', () => {
  let s, x, i, e, v

  s = 0 // start
  x = 1 // target
  i = 0.5 // interpolate
  e = 0.5 // expected
  v = 'float' // valueType
  expect(macroInterpolate(s, x, i, v)).toBeCloseTo(e, 5)

  s = 1 // start
  x = 0 // target
  i = 0.5 // interpolate
  e = 0.5 // expected
  v = 'float' // valueType
  expect(macroInterpolate(s, x, i, v)).toBeCloseTo(e, 5)

  s = 0.5 // start
  x = 0.6 // target
  i = 0.5 // interpolate
  e = 0.55 // expected
  v = 'float' // valueType
  expect(macroInterpolate(s, x, i, v)).toBeCloseTo(e, 5)

  s = 0.6 // start
  x = 0.5 // target
  i = 0.5 // interpolate
  e = 0.55 // expected
  v = 'float' // valueType
  expect(macroInterpolate(s, x, i, v)).toBeCloseTo(e, 5)

  s = 0.1 // start
  x = 0.2 // target
  i = 0.75 // interpolate
  e = 0.175 // expected
  v = 'float' // valueType
  expect(macroInterpolate(s, x, i, v)).toBeCloseTo(e, 5)

  s = true // start
  x = false // target
  i = 1 // interpolate
  e = false // expected
  v = 'boolean' // valueType
  expect(macroInterpolate(s, x, i, v)).toBe(e)

  s = false // start
  x = true // target
  i = 1 // interpolate
  e = true // expected
  v = 'boolean' // valueType
  expect(macroInterpolate(s, x, i, v)).toBe(e)

  s = true // start
  x = false // target
  i = 0.991 // interpolate
  e = false // expected
  v = 'boolean' // valueType
  expect(macroInterpolate(s, x, i, v)).toBe(e)

  s = true // start
  x = false // target
  i = 0.8 // interpolate
  e = true // expected
  v = 'boolean' // valueType
  expect(macroInterpolate(s, x, i, v)).toBe(e)

  s = false // start
  x = true // target
  i = 0.4 // interpolate
  e = false // expected
  v = 'boolean' // valueType
  expect(macroInterpolate(s, x, i, v)).toBe(e)
})
