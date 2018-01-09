import test from 'tape'
import { getAssignedLinks } from '../selectors'
import deepFreeze from 'deep-freeze'

test('(Selector) inputs - getAssignedLinks', (t) => {
  const state = {
    inputs: {
      audio_0: {
        assignedLinkIds: ['XX', 'YY', 'ZZ']
      }
    },
    nodes: {
      nx: {
        activeInputLinkId: 'XX'
      },
      ny: {
        activeInputLinkId: 'YY'
      },
      nz: {
        activeInputLinkId: 'ZZ'
      }
    },
    inputLinks: {
      XX: { nodeId: 'nx' },
      YY: { nodeId: 'ny' },
      ZZ: { nodeId: 'nz' }
    }
  }
  deepFreeze(state)

  const expected = [
    { nodeId: 'nx' },
    { nodeId: 'ny' },
    { nodeId: 'nz' }
  ]

  const actual = getAssignedLinks(state, 'audio_0')

  t.deepEqual(actual, expected, 'Returns array of nodes')
  t.end()
})

test('(Selector) inputs - getAssignedLinks - input doesnt exist', (t) => {
  const state = {
    inputs: {
      foo_input: {
        assignedLinkIds: ['XX', 'YY', 'ZZ']
      }
    },
    nodes: {
      nx: {
        activeInputLinkId: 'XX'
      },
      ny: {
        activeInputLinkId: 'YY'
      },
      nz: {
        activeInputLinkId: 'ZZ'
      }
    },
    inputLinks: {
      XX: { nodeId: 'nx' },
      YY: { nodeId: 'ny' },
      ZZ: { nodeId: 'nz' }
    }
  }
  deepFreeze(state)

  const expected = []

  const actual = getAssignedLinks(state, 'non_existing_input')

  t.deepEqual(actual, expected, 'Returns empty array')
  t.end()
})

test('(Selector) inputs - getAssignedLinks - one input link isnt active', (t) => {
  const state = {
    inputs: {
      foo_input: {
        assignedLinkIds: ['XX', 'YY', 'ZZ']
      }
    },
    nodes: {
      nx: {
        activeInputLinkId: 'XX'
      },
      ny: {
        activeInputLinkId: 'YY'
      },
      nz: {
        activeInputLinkId: '@@'
      }
    },
    inputLinks: {
      XX: { nodeId: 'nx' },
      YY: { nodeId: 'ny' },
      ZZ: { nodeId: 'nz' }
    }
  }
  deepFreeze(state)

  const expected = [
    { nodeId: 'nx' },
    { nodeId: 'ny' }
  ]

  const actual = getAssignedLinks(state, 'foo_input')

  t.deepEqual(actual, expected, 'Returns array with one link missing because not active')
  t.end()
})

test('(Selector) inputs - getAssignedLinks - inputLink doesnt have node but another input link', (t) => {
  const state = {
    inputs: {
      foo_input: {
        assignedLinkIds: ['XX']
      }
    },
    nodes: {

    },
    inputLinks: {
      XX: {
        nodeId: 'INPUTLINKID',
        inputLinkIdToToggle: 'INPUTLINKID'
      }
    }
  }
  deepFreeze(state)

  const expected = [
    {
      nodeId: 'INPUTLINKID',
      inputLinkIdToToggle: 'INPUTLINKID'
    }
  ]

  const actual = getAssignedLinks(state, 'foo_input')

  t.deepEqual(actual, expected, 'Returns inputlink without node')
  t.end()
})

test('(Selector) inputs - getAssignedLinks - inputLinks dont exist', (t) => {
  const state = {
    inputs: {
      audio_0: {
        assignedLinkIds: ['XX', 'YY', 'ZZ']
      }
    },
    inputLinks: {}
  }

  t.throws(getAssignedLinks.bind(null, state, 'audio_0'), Error, 'Throws an error')
  t.end()
})
