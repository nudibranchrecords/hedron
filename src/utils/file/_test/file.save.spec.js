import test from 'tape'
import sinon from 'sinon'
import proxyquire from 'proxyquire'

const spies = {
  write: sinon.spy()
}

const save = proxyquire('../', {
  jsonfile: {
    writeFile: spies.write
  }
}).save

test('(Util) file.save', (t) => {
  const path = 'some/path'
  const data = { foo:'bar' }

  save(path, data)

  t.equal(spies.write.calledWith(path, data), true, 'jsonfile called')
  t.end()
})
