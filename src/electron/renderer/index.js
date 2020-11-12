import './globalVars'

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import { projectFilepathUpdate, projectLoadRequest } from '../../store/project/actions'
import { ConnectedRouter, routerMiddleware } from 'connected-react-router'
import listen from 'redux-action-listeners'
import history from '../../history'
import { composeWithDevTools } from 'redux-devtools-extension'
import { batchedSubscribe } from 'redux-batched-subscribe'
import rootReducer from '../../store/rootReducer'
import rootListener from '../../store/rootListener'
import App from '../../containers/App'
import * as engine from '../../engine'
import { initiateScreens } from '../../windows'
import { initiateMenuHandler } from './menuHandler'
import setCoreState from '../../store/setCoreState'
import Stats from 'stats.js'
import createDebounce from 'redux-debounced'
import tryRequire from 'try-require'

import '../../style.css'

// inputs
import initiateAudio from '../../inputs/AudioInput'
import initiateMidi from '../../inputs/MidiInput'
import initiateGeneratedClock from '../../inputs/GeneratedClock'
import debounce from 'lodash/debounce'
import { initiateClock } from '../../clock'

const isDevelopment = process.env.NODE_ENV !== 'production'
const devConfig = tryRequire('../../config/dev.config')

const stats = new Stats()
stats.dom.setAttribute('style', '')

let composeEnhancers

if (process.env.NODE_ENV !== 'development') {
  composeEnhancers = compose
} else {
  composeEnhancers = composeWithDevTools({
    actionsBlacklist: [
      'CLOCK_BEAT_INC', 'CLOCK_BPM_UPDATE', 'INPUT_FIRED',
      'NODE_VALUE_UPDATE', 'NODE_RANGE_UPDATE', 'NODE_SHOT_ARM', 'NODE_SHOT_DISARM', 'NODE_SHOT_FIRED',
      'NODE_VALUES_BATCH_UPDATE',
    ],
    maxAge: 10,
  })
}

const debounceNotify = debounce(notify => notify())

const store = createStore(rootReducer, composeEnhancers(
  applyMiddleware(
    routerMiddleware(history),
    createDebounce(),
    listen(rootListener)
  ),
  batchedSubscribe(debounceNotify)
))

setCoreState(store)

const renderApp = (Component) => {
  render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App stats={stats} />
      </ConnectedRouter>
    </Provider>,
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
initiateClock(store)

engine.run(store, stats)

if (isDevelopment) {
  loadDefaultProject()
}

if (module.hot) {
  module.hot.accept('../../containers/App', () => {
    // Pausing engine after HMR to stop lag issue
    engine.pause()
    renderApp(App)
  })
}
