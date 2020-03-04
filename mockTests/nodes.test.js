import listen from 'redux-action-listeners'
import { createStore, applyMiddleware, combineReducers } from 'redux'

import nodesReducer from '../src/store/nodes/reducer'
import nodesListener from '../src/store/nodes/listener'

import {
  uNodeDelete, rNodeCreate, uNodeInputLinkAdd,
} from '../src/store/nodes/actions'

import { MockUid } from './utils/MockUid'

const mockUid = new MockUid()

jest.mock('uid', () => () => mockUid.getNewId())

const rootListener = {
  types: 'all',

  handleAction (action, dispatched, store) {
    nodesListener(action, store)
  },
}

test('(mock) Nodes - Add/Delete nodes', () => {
  const rootReducer = combineReducers(
    {
      nodes: nodesReducer,
    }
  )

  const store = createStore(rootReducer, {
    nodes: {},
  }, applyMiddleware(listen(rootListener)))

  let state

  state = store.getState()

  // 'nodes start empty'
  expect(state.nodes).toEqual({})

  store.dispatch(rNodeCreate('node_1', {
    id: 'node_1',
  }))

  store.dispatch(rNodeCreate('node_2', {
    id: 'node_2',
  }))

  state = store.getState()

  // 2 nodes added
  expect(state.nodes).toMatchObject({
    node_1: {
      id: 'node_1',
    },
    node_2: {
      id: 'node_2',
    },
  })

  store.dispatch(uNodeInputLinkAdd('node_1', 'link_1'))
  store.dispatch(uNodeInputLinkAdd('node_1', 'link_2'))

  state = store.getState()

  // 2 links added, most recently added link is open
  expect(state.nodes).toMatchObject({
    node_1: {
      id: 'node_1',
      inputLinkIds: ['link_1', 'link_2'],
      openedLinkId: 'link_2',
    },
    node_2: {
      id: 'node_2',
      inputLinkIds: [],
    },
  })

  store.dispatch(uNodeDelete('node_1'))
  store.dispatch(uNodeDelete('node_2'))

  state = store.getState()

  // All nodes deleted
  expect(state).toEqual({
    nodes: {},
  })
})
