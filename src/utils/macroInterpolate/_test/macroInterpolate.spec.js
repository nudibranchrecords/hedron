import test from 'tape'
import macroInterpolate from '../'

test('(Util) macroInterpolate', (t) => {
  let s, x, i, e, a

  s = 0 // start
  x = 1 // target
  i = 0.5 // interpolate
  e = 0.5 // expected
  t.equal(macroInterpolate(s, x, i), e)

  s = 1 // start
  x = 0 // target
  i = 0.5 // interpolate
  e = 0.5 // expected
  t.equal(macroInterpolate(s, x, i), e)

  s = 0.5 // start
  x = 0.6 // target
  i = 0.5 // interpolate
  e = 0.55 // expected
  t.equal(macroInterpolate(s, x, i), e)

  s = 0.6 // start
  x = 0.5 // target
  i = 0.5 // interpolate
  e = 0.55 // expected
  t.equal(macroInterpolate(s, x, i), e)

  s = 0.1 // start
  x = 0.2 // target
  i = 0.75 // interpolate
  e = 0.175 // expected
  a = Math.round(macroInterpolate(s, x, i) * 1000) / 1000
  t.equal(a, e)

  t.end()
})
