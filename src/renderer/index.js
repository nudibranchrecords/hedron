import { ipcRenderer } from 'electron'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import { projectFilepathUpdate, projectLoadRequest } from '../store/project/actions'
import { ConnectedRouter, routerMiddleware } from 'react-router-redux'
import history from '../history'
import { composeWithDevTools } from 'redux-devtools-extension'
import createSagaMiddleware from 'redux-saga'
import { batchedSubscribe } from 'redux-batched-subscribe'
import rootSaga from '../store/rootSaga'
import rootReducer from '../store/rootReducer'
import App from '../containers/App'
import engine from '../engine'
import { initiateScreens } from '../windows'
import { initiateMenuHandler } from './menuHandler'
import Stats from 'stats.js'
import createDebounce from 'redux-debounced'
import tryRequire from 'try-require'

import 'react-select/dist/react-select.css'
import '../style.css'

// inputs
import initiateAudio from '../inputs/AudioInput'
import initiateMidi from '../inputs/MidiInput'
import initiateGeneratedClock from '../inputs/GeneratedClock'
import debounce from 'lodash/debounce'

const isDevelopment = process.env.NODE_ENV !== 'production'
const devConfig = tryRequire('../../config/dev.config')

const stats = new Stats()
stats.dom.setAttribute('style', '')

let composeEnhancers

if (process.env.NODE_ENV !== 'development') {
  composeEnhancers = compose
} else {
  composeEnhancers = composeWithDevTools({
    // Redux devtools plays up due to the fact so many fast firing actions
    // are blacklisted. maxAge and latency below helps but isn't perfect
    // https://github.com/zalmoxisus/redux-devtools-extension/issues/316
    maxAge: 1000,
    latency: 3000,
    actionsBlacklist: [
      'CLOCK_PULSE', 'CLOCK_BEAT_INC', 'CLOCK_BPM_UPDATE', 'INPUT_FIRED',
      'NODE_VALUE_UPDATE', 'NODE_SHOT_ARM', 'NODE_SHOT_DISARM', 'NODE_SHOT_FIRED',
      'NODE_VALUES_BATCH_UPDATE'
    ]
  })
}

const debounceNotify = debounce(notify => notify())

const sagaMiddleware = createSagaMiddleware()

const store = createStore(rootReducer, composeEnhancers(
  applyMiddleware(routerMiddleware(history)),
  applyMiddleware(createDebounce()),
  applyMiddleware(sagaMiddleware),
  batchedSubscribe(debounceNotify)
))

sagaMiddleware.run(rootSaga, store.dispatch)

const renderApp = (Component) => {
  render(
    // <AppContainer>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App stats={stats} />
      </ConnectedRouter>
    </Provider>,
    // </AppContainer>,
    document.getElementById('app')
  )
}

const loadDefaultProject = () => {
  if (devConfig && devConfig.defaultProject) {
    store.dispatch(projectFilepathUpdate(devConfig.defaultProject))
    store.dispatch(projectLoadRequest())
  }
}

renderApp(App)

initiateMenuHandler(store)
initiateAudio(store)
initiateMidi(store)
initiateGeneratedClock(store)
initiateScreens(store)
engine.run(store, stats)

if (isDevelopment) {
  loadDefaultProject()
}

// Load default project if running the app with '--devDist'
ipcRenderer.on('args', (event, data) => {
  if (data.distDev) {
    loadDefaultProject()
  }
})

if (module.hot) {
  module.hot.accept('../containers/App', () => {
    // Pausing engine after HMR to stop lag issue
    engine.pause()
    renderApp(App)
  })
}
