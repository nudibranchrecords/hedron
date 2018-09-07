import test from 'tape'
import lfoProcess from '../'

const PI2 = Math.PI * 2

const roundFix = v => Math.round(v * 10000000000) / 10000000000

test('(Util) lfoProcess - get sin value when using sine', (t) => {
  const actual = lfoProcess(0.123, 'sine', 1, 0)
  const expected = Math.sin(0.123 * PI2) * 0.5 + 0.5

  t.equal(roundFix(actual), roundFix(expected))
  t.end()
})

test('(Util) lfoProcess - get cos value when using sine and phase of 0.25', (t) => {
  const actual = lfoProcess(0.123, 'sine', 1, 0.25)
  const expected = Math.cos(0.123 * PI2) * 0.5 + 0.5

  t.equal(roundFix(actual), roundFix(expected))
  t.end()
})
