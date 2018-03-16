import scenesListener from '../scenes/listener'

export default {
  types: 'all',

  handleAction (action, dispatched, store) {
    scenesListener(action, store)
  }
}
