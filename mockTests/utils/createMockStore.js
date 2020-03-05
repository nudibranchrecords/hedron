/** * SETUP ***/

import listen from 'redux-action-listeners'
import { createStore, applyMiddleware, combineReducers } from 'redux'

import createSagaMiddleware from 'redux-saga'
const sagaMiddleware = createSagaMiddleware()

export const createMockStore = ({ startState, reducers, rootSaga, listeners }) => {
  const rootReducer = combineReducers(reducers)

  const rootListener = {
    types: 'all',

    handleAction (action, dispatched, store) {
      listeners.forEach(listener => {
        listener(action, store)
      })
    },
  }

  const store = createStore(rootReducer, startState, applyMiddleware(sagaMiddleware, listen(rootListener)))
  if (rootSaga) {
    sagaMiddleware.run(rootSaga, store.dispatch)
  }

  return { store, startState: store.getState() }
}
