/** * SETUP ***/

import listen from 'redux-action-listeners'
import { createStore, applyMiddleware, combineReducers } from 'redux'

export const createMockStore = ({ startState, reducers, listeners }) => {
  const rootReducer = combineReducers(reducers)

  const rootListener = {
    types: 'all',

    handleAction (action, dispatched, store) {
      listeners.forEach(listener => {
        listener(action, store)
      })
    },
  }

  const store = createStore(rootReducer, startState, applyMiddleware(listen(rootListener)))

  return { store, startState: store.getState() }
}
