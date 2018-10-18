import test from 'tape'
import sinon from 'sinon'
import proxyquire from 'proxyquire'

const spies = {
  write: sinon.spy(),
  read: sinon.spy(),
}

const file = proxyquire('../', {
  jsonfile: {
    writeFile: spies.write,
    readFile: spies.read,
  },
})

test('(Util) file.save', (t) => {
  const path = 'some/path'
  const data = { foo:'bar' }

  file.save(path, data)

  t.equal(spies.write.calledWith(path, data), true, 'jsonfile called')
  t.end()
})

test('(Util) file.load', (t) => {
  const path = 'some/path'

  file.load(path)

  t.equal(spies.write.calledWith(path), true, 'jsonfile called')
  t.end()
})
