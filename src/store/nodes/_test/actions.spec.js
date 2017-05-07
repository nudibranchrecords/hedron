import test from 'tape'
import * as a from '../actions'

test('(Action Creator) uNodeCreate', (t) => {
  let actual = a.uNodeCreate('XXX', {
    title: 'Foo',
    id: 'XXX',
    value: 0.5
  })
  let expected = {
    type: 'U_NODE_CREATE',
    payload: {
      id: 'XXX',
      node: {
        title: 'Foo',
        id: 'XXX',
        value: 0.5
      }
    }
  }
  t.deepEqual(actual, expected, 'Creates action to create node')
  t.end()
})

test('(Action Creator) nodeOpenToggle', (t) => {
  let actual = a.nodeOpenToggle('XXX')
  let expected = {
    type: 'NODE_OPEN_TOGGLE',
    payload: {
      id: 'XXX'
    }
  }
  t.deepEqual(actual, expected, 'Creates action to open/close node')
  t.end()
})

test('(Action Creator) nodeShotFired', (t) => {
  let actual = a.nodeShotFired('XXX', 'explode')
  let expected = {
    type: 'NODE_SHOT_FIRED',
    payload: {
      sketchId: 'XXX',
      method: 'explode'
    }
  }
  t.deepEqual(actual, expected, 'Creates action to fire node shot')
  t.end()
})

test('(Action Creator) rNodeDelete', (t) => {
  let actual = a.rNodeDelete('XXX')
  let expected = {
    type: 'R_NODE_DELETE',
    payload: {
      id: 'XXX'
    }
  }
  t.deepEqual(actual, expected, 'Creates action to delete node')
  t.end()
})

test('(Action Creator) rNodeCreate', (t) => {
  let actual = a.rNodeCreate('XXX', {
    title: 'Foo',
    id: 'XXX',
    value: 0.5
  })
  let expected = {
    type: 'R_NODE_CREATE',
    payload: {
      id: 'XXX',
      node: {
        title: 'Foo',
        id: 'XXX',
        value: 0.5
      }
    }
  }
  t.deepEqual(actual, expected, 'Creates action to create node')
  t.end()
})

test('(Action Creator) uNodeDelete', (t) => {
  let actual = a.uNodeDelete('XXX')
  let expected = {
    type: 'U_NODE_DELETE',
    payload: {
      id: 'XXX'
    }
  }
  t.deepEqual(actual, expected, 'Creates action to delete node')
  t.end()
})

test('(Action Creator) nodeValueUpdate', (t) => {
  let actual = a.nodeValueUpdate('XXX', 0.1)
  let expected = {
    type: 'NODE_VALUE_UPDATE',
    payload: {
      id: 'XXX',
      value: 0.1
    }
  }
  t.deepEqual(actual, expected, 'Creates action to update node value')
  t.end()
})

test('(Action Creator) nodesReplaceAll', (t) => {
  const nodes = ['foo', 'bar']
  let actual = a.nodesReplaceAll(nodes)
  let expected = {
    type: 'NODES_REPLACE_ALL',
    payload: {
      nodes
    }
  }
  t.deepEqual(actual, expected, 'Creates action to replace all nodes')
  t.end()
})

test('(Action Creator) uNodeInputUpdate', (t) => {
  let actual = a.uNodeInputUpdate('node1', 'audio_0', 'audio')
  let expected = {
    type: 'U_NODE_INPUT_UPDATE',
    payload: {
      nodeId: 'node1',
      inputId: 'audio_0',
      inputType: 'audio'
    }
  }
  t.deepEqual(actual, expected, 'Creates action to change node input')
  t.end()
})

test('(Action Creator) rNodeInputUpdate', (t) => {
  let actual = a.rNodeInputUpdate('node1', {
    id: 'audio_0',
    foo: 'bar'
  })

  let expected = {
    type: 'R_NODE_INPUT_UPDATE',
    payload: {
      nodeId: 'node1',
      input: {
        id: 'audio_0',
        foo: 'bar'
      }
    }
  }
  t.deepEqual(actual, expected, 'Creates action to change node input')
  t.end()
})

test('(Action Creator) nodeShotArm', (t) => {
  let actual = a.nodeShotArm('node1')

  let expected = {
    type: 'NODE_SHOT_ARM',
    payload: {
      nodeId: 'node1'
    }
  }
  t.deepEqual(actual, expected, 'Creates action to arm shot node')
  t.end()
})

test('(Action Creator) nodeShotDisarm', (t) => {
  let actual = a.nodeShotDisarm('node1')

  let expected = {
    type: 'NODE_SHOT_DISARM',
    payload: {
      nodeId: 'node1'
    }
  }
  t.deepEqual(actual, expected, 'Creates action to arm shot node')
  t.end()
})
