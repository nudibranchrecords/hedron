import getNodeAncestors from '../getNodeAncestors'

test('(selector) getNodeAncestors', () => {
  const state = {
    nodes: {
      aaa: {
        title: 'A',
        parentNodeId: 'bbb',
      },
      bbb: {
        title: 'B',
        parentNodeId: 'ccc',
      },
      xxx: {
        title: 'X',
      },
      ccc: {
        title: 'C',
        parentNodeId: 'xxx',
      },
    },
  }

  const expected = [
    {
      title: 'A',
      parentNodeId: 'bbb',
    },
    {
      title: 'B',
      parentNodeId: 'ccc',
    },
    {
      title: 'C',
      parentNodeId: 'xxx',
    },
    {
      title: 'X',
    },
  ]

  const actual = getNodeAncestors(state, 'aaa')

  expect(actual).toEqual(expected)
})
