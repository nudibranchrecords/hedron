import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { MemoryRouter } from 'react-router'
import rootReducer from './reducers'
import App from './components/App'
import engine from './engine'

import { AppContainer } from 'react-hot-loader'

let store = createStore(rootReducer)

engine(store)

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
