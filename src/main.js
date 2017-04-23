import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { MemoryRouter } from 'react-router'
import { composeWithDevTools } from 'remote-redux-devtools'
import createSagaMiddleware from 'redux-saga'
import rootSaga from './store/rootSaga'
import rootReducer from './store/rootReducer'
import App from './components/App'
import Engine from './Engine'
import Stats from 'stats.js'
import './windows'

// inputs
import initiateAudio from './inputs/AudioInput'
import initiateMidi from './inputs/MidiInput'
import { initiateGenerateClock } from './inputs/GeneratedClock'

import { AppContainer } from 'react-hot-loader'

const stats = new Stats()
stats.dom.setAttribute('style', '')

const composeEnhancers = composeWithDevTools({
  realtime: true,
  actionsBlacklist: ['CLOCK_PULSE', 'INPUT_FIRED', 'PARAM_VALUE_UPDATE']
})

const sagaMiddleware = createSagaMiddleware()

const store = createStore(rootReducer, composeEnhancers(
  applyMiddleware(sagaMiddleware)
))

sagaMiddleware.run(rootSaga)

const renderApp = (Component) => {
  render(
    <AppContainer>
      <Provider store={store}>
        <MemoryRouter>
          <App stats={stats} />
        </MemoryRouter>
      </Provider>
    </AppContainer>,
    document.getElementById('root')
  )
}

renderApp(App)

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./components/App', () => {
    renderApp(App)
  })
}

initiateAudio(store)
initiateMidi(store)
initiateGenerateClock(store)
Engine.run(store, stats)
