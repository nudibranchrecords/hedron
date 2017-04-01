import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { MemoryRouter } from 'react-router'
import devToolsEnhancer from 'remote-redux-devtools'

import rootReducer from './reducers'
import App from './components/App'
import Engine from './Engine'

import { AppContainer } from 'react-hot-loader'

const store = createStore(rootReducer, devToolsEnhancer({ realtime: true }))

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
