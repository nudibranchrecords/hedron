import test from 'tape'
import { newData, clear } from '../'

test('(Util) getMidiMode - type isnt "controlChange"', (t) => {
  clear()

  t.equal(newData([0, 0, 100], 'foo'), 'ignore', 'returns "ignore"')
  t.equal(newData([0, 0, 0], 'bar'), 'ignore', 'returns "ignore"')
  t.equal(newData([0, 0, 127], 'lorem'), 'ignore', 'returns "ignore"')

  t.end()
})

test('(Util) getMidiMode - type is "controlChange" - absolute value from start', (t) => {
  clear()

  t.equal(newData([0, 0, 2], 'controlChange'), 'abs',
    'returns "abs" if value isnt one of the rel values (1, 63, 65, 127)'
  )

  t.equal(newData([0, 0, 5], 'controlChange'), 'abs',
    'returns "abs" if value isnt one of the rel values (1, 63, 65, 127)'
  )

  t.equal(newData([0, 0, 10], 'controlChange'), 'abs',
    'returns "abs" if value isnt one of the rel values (1, 63, 65, 127)'
  )

  t.equal(newData([0, 0, 62], 'controlChange'), 'abs',
    'returns "abs" if value isnt one of the rel values (1, 63, 65, 127)'
  )

  t.equal(newData([0, 0, 66], 'controlChange'), 'abs',
    'returns "abs" if value isnt one of the rel values (1, 63, 65, 127)'
  )

  t.equal(newData([0, 0, 126], 'controlChange'), 'abs',
    'returns "abs" if value isnt one of the rel values (1, 63, 65, 127)'
  )

  t.end()
})

test('(Util) getMidiMode - type is "controlChange" - rel values and then abs', (t) => {
  clear()

  t.equal(newData([0, 0, 1], 'controlChange'), 'learning',
    '1. returns "learning" if first value is one of the rel values (1, 63, 65, 127)'
  )

  t.equal(newData([0, 0, 127], 'controlChange'), 'learning',
    '3. returns "learning" if second value is one of the rel values (1, 63, 65, 127)'
  )

  t.equal(newData([0, 0, 1], 'controlChange'), 'learning',
    '4. returns "learning" if third value is one of the rel values (1, 63, 65, 127)'
  )

  t.equal(newData([0, 0, 127], 'controlChange'), 'learning',
    '2. returns "learning" if fourth value is one of the rel values (1, 63, 65, 127)'
  )

  t.equal(newData([0, 0, 10], 'controlChange'), 'abs',
    '5. returns "abs" if fifth value ISNT one of the rel values (1, 63, 65, 127)'
  )

  t.end()
})

test('(Util) getMidiMode - type is "controlChange" - all rel values', (t) => {
  clear()

  t.equal(newData([0, 0, 1], 'controlChange'), 'learning',
    '1. returns "learning" if first value is one of the rel1 values (1, 127)'
  )

  t.equal(newData([0, 0, 127], 'controlChange'), 'learning',
    '3. returns "learning" if second value is one of the rel1 values (1, 127)'
  )

  t.equal(newData([0, 0, 1], 'controlChange'), 'learning',
    '4. returns "learning" if third value is one of the rel1 values (1, 127)'
  )

  t.equal(newData([0, 0, 127], 'controlChange'), 'learning',
    '2. returns "learning" if fourth value is one of the rel1 values (1, 127)'
  )

  t.equal(newData([0, 0, 1], 'controlChange'), 'rel1',
    '5. returns "rel1" if fifth value is one of the rel1 values (1, 127)'
  )

  t.end()
})

test('(Util) getMidiMode - type is "controlChange" - all rel values but only the same for the first five', (t) => {
  clear()

  t.equal(newData([0, 0, 1], 'controlChange'), 'learning',
    '1. returns "learning" if first value is one of the rel1 values (1)'
  )

  t.equal(newData([0, 0, 1], 'controlChange'), 'learning',
    '3. returns "learning" if second value is same'
  )

  t.equal(newData([0, 0, 1], 'controlChange'), 'learning',
    '4. returns "learning" if third value is same'
  )

  t.equal(newData([0, 0, 1], 'controlChange'), 'learning',
    '2. returns "learning" if fourth value is same'
  )

  t.equal(newData([0, 0, 1], 'controlChange'), 'learning',
    '5. returns "learning" if fifth value is same'
  )

  t.equal(newData([0, 0, 127], 'controlChange'), 'rel1',
    '6. returns "rel1" if sixth value is the other rel1 value (127)'
  )

  t.end()
})

test('(Util) getMidiMode - type is "controlChange" - all rel values (rel2)', (t) => {
  clear()

  t.equal(newData([0, 0, 65], 'controlChange'), 'learning',
    '1. returns "learning" if first value is one of the rel2 values (1, 127)'
  )

  t.equal(newData([0, 0, 63], 'controlChange'), 'learning',
    '3. returns "learning" if second value is one of the rel2 values (1, 127)'
  )

  t.equal(newData([0, 0, 65], 'controlChange'), 'learning',
    '4. returns "learning" if third value is one of the rel2 values (1, 127)'
  )

  t.equal(newData([0, 0, 63], 'controlChange'), 'learning',
    '2. returns "learning" if fourth value is one of the rel2 values (1, 127)'
  )

  t.equal(newData([0, 0, 65], 'controlChange'), 'rel2',
    '5. returns "rel1" if fifth value is one of the rel2 values (1, 127)'
  )

  t.end()
})

test('(Util) getMidiMode - type is "controlChange" - midi control changes half way through', (t) => {
  clear()

  t.equal(newData([0, 0, 65], 'controlChange'), 'learning',
    '1. returns "learning" if first value is one of the rel2 values (1, 127)'
  )

  t.equal(newData([0, 0, 63], 'controlChange'), 'learning',
    '3. returns "learning" if second value is one of the rel2 values (1, 127)'
  )

  t.equal(newData([0, 0, 65], 'controlChange'), 'learning',
    '4. returns "learning" if third value is one of the rel2 values (1, 127)'
  )

  t.equal(newData([0, 0, 63], 'controlChange'), 'learning',
    '2. returns "learning" if fourth value is one of the rel2 values (1, 127)'
  )

  t.equal(newData([1, 0, 65], 'controlChange'), 'learning',
    '5. returns "learning" if control changes (first or second part of array)'
  )

  t.end()
})
