import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { MemoryRouter } from 'react-router'
import { composeWithDevTools } from 'remote-redux-devtools'
import createSagaMiddleware from 'redux-saga'
import saveSaga from './store/saveSaga'
import rootReducer from './store/rootReducer'
import App from './components/App'
import Engine from './Engine'

import { AppContainer } from 'react-hot-loader'

const composeEnhancers = composeWithDevTools({ realtime: true })

const sagaMiddleware = createSagaMiddleware()

const store = createStore(rootReducer, composeEnhancers(
  applyMiddleware(sagaMiddleware)
))

sagaMiddleware.run(saveSaga)

const renderApp = (Component) => {
  render(
    <AppContainer>
      <Provider store={store}>
        <MemoryRouter>
          <App />
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

Engine.run(store)
