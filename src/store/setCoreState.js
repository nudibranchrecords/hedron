/**
  Items that are hard items of the store, set from the beginning of the app.
**/

import { uNodeCreate } from './nodes/actions'

export default store => {
  store.dispatch(uNodeCreate('audioNormalizeLevels', {
    title: 'Normalize Levels',
    type: 'param',
    value: 0.5,
    id: 'audioNormalizeLevels'
  }))

  store.dispatch(uNodeCreate('audioLevelsFalloff', {
    title: 'Levels Falloff',
    type: 'param',
    value: 1,
    id: 'audioLevelsFalloff'
  }))
}
