import test from 'tape'
import { getAssignedLinks } from '../selectors'
import deepFreeze from 'deep-freeze'

test('(Selector) inputs - getAssignedLinks', (t) => {
  const state = {
    inputs: {
      audio_0: {
        assignedLinkIds: ['XX', 'YY', 'ZZ'],
      },
    },
    nodes: {
      nx: {
        activeInputLinkId: 'XX',
      },
      ny: {
        activeInputLinkId: 'YY',
      },
      nz: {
        activeInputLinkId: 'ZZ',
      },
    },
    inputLinks: {
      XX: { nodeId: 'nx' },
      YY: { nodeId: 'ny' },
      ZZ: { nodeId: 'nz' },
    },
  }
  deepFreeze(state)

  const expected = [
    { nodeId: 'nx' },
    { nodeId: 'ny' },
    { nodeId: 'nz' },
  ]

  const actual = getAssignedLinks(state, 'audio_0')

  t.deepEqual(actual, expected, 'Returns array of nodes')
  t.end()
})

test('(Selector) inputs - getAssignedLinks - input doesnt exist', (t) => {
  const state = {
    inputs: {
      foo_input: {
        assignedLinkIds: ['XX', 'YY', 'ZZ'],
      },
    },
    nodes: {
      nx: {
        activeInputLinkId: 'XX',
      },
      ny: {
        activeInputLinkId: 'YY',
      },
      nz: {
        activeInputLinkId: 'ZZ',
      },
    },
    inputLinks: {
      XX: { nodeId: 'nx' },
      YY: { nodeId: 'ny' },
      ZZ: { nodeId: 'nz' },
    },
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
        assignedLinkIds: ['XX', 'YY', 'ZZ'],
      },
    },
    nodes: {
      nx: {
        activeInputLinkId: 'XX',
      },
      ny: {
        activeInputLinkId: 'YY',
      },
      nz: {
        activeInputLinkId: '@@',
      },
    },
    inputLinks: {
      XX: { nodeId: 'nx' },
      YY: { nodeId: 'ny' },
      ZZ: { nodeId: 'nz' },
    },
  }
  deepFreeze(state)

  const expected = [
    { nodeId: 'nx' },
    { nodeId: 'ny' },
  ]

  const actual = getAssignedLinks(state, 'foo_input')

  t.deepEqual(actual, expected, 'Returns array with one link missing because not active')
  t.end()
})

test('(Selector) inputs - getAssignedLinks - link type midi', (t) => {
  const state = {
    inputs: {
      foo_input: {
        assignedLinkIds: ['XX', 'YY'],
      },
    },
    nodes: {
      nx: {
        activeInputLinkId: undefined,
      },
      ny: {
        activeInputLinkId: undefined,
      },
    },
    inputLinks: {
      XX: {
        nodeId: 'nx',
        input: {
          type: 'midi',
        },
      },
      YY: { nodeId: 'ny' },
    },
  }
  deepFreeze(state)

  const expected = [
    {
      nodeId: 'nx',
      input: {
        type: 'midi',
      },
    },
  ]

  const actual = getAssignedLinks(state, 'foo_input')

  t.deepEqual(actual, expected, 'Always returns input link with input type of midi, even if inactive')
  t.end()
})

test('(Selector) inputs - getAssignedLinks - link type midi', (t) => {
  const state = {
    inputs: {
      foo_input: {
        assignedLinkIds: ['XX', 'YY'],
      },
    },
    nodes: {
      nx: {
        activeInputLinkId: undefined,
      },
      ny: {
        activeInputLinkId: undefined,
      },
    },
    inputLinks: {
      XX: { nodeId: 'nx' },
      YY: {
        nodeId: '@@',
        linkType: 'linkableAction',
      },
    },
  }
  deepFreeze(state)

  const expected = [
    {
      nodeId: '@@',
      linkType: 'linkableAction',
    },
  ]

  const actual = getAssignedLinks(state, 'foo_input')

  t.deepEqual(actual, expected, 'Always returns input link with linkType of linkableAction, even if inactive')
  t.end()
})

test('(Selector) inputs - getAssignedLinks - link has device Id and bank index (doesnt match current)', (t) => {
  const state = {
    inputs: {
      foo_input: {
        assignedLinkIds: ['XX', 'YY'],
        deviceId: 'DEVICE_1',
      },
    },
    midi: {
      devices: {
        DEVICE_1: {
          bankIndex: 1,
        },
      },
    },
    nodes: {
      nx: {
        activeInputLinkId: 'XX',
      },
      ny: {
        activeInputLinkId: 'YY',
      },
    },
    inputLinks: {
      XX: {
        nodeId: 'nx',
        deviceId: 'DEVICE_1',
        bankIndex: 2,
      },
      YY: { nodeId: 'ny' },
    },
  }
  deepFreeze(state)

  const expected = [
    {
      nodeId: 'ny',
    },
  ]

  const actual = getAssignedLinks(state, 'foo_input')

  t.deepEqual(actual, expected, 'Doesnt return one of the links because bankIndex doesnt match')
  t.end()
})

test('(Selector) inputs - getAssignedLinks - link has device Id and bank index (does match current)', (t) => {
  const state = {
    inputs: {
      foo_input: {
        assignedLinkIds: ['XX', 'YY'],
        deviceId: 'DEVICE_1',
      },
    },
    midi: {
      devices: {
        DEVICE_1: {
          bankIndex: 1,
        },
      },
    },
    nodes: {
      nx: {
        activeInputLinkId: 'XX',
      },
      ny: {
        activeInputLinkId: 'YY',
      },
    },
    inputLinks: {
      XX: {
        nodeId: 'nx',
        deviceId: 'DEVICE_1',
        bankIndex: 1,
      },
      YY: { nodeId: 'ny' },
    },
  }
  deepFreeze(state)

  const expected = [
    {
      nodeId: 'nx',
      deviceId: 'DEVICE_1',
      bankIndex: 1,
    },
    {
      nodeId: 'ny',
    },
  ]

  const actual = getAssignedLinks(state, 'foo_input')

  t.deepEqual(actual, expected, 'Doesnt return one of the links because bankIndex doesnt match')
  t.end()
})

test('(Selector) inputs - getAssignedLinks - inputLinks dont exist', (t) => {
  const state = {
    inputs: {
      audio_0: {
        assignedLinkIds: ['XX', 'YY', 'ZZ'],
      },
    },
    inputLinks: {},
  }

  t.throws(getAssignedLinks.bind(null, state, 'audio_0'), Error, 'Throws an error')
  t.end()
})
