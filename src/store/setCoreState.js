/**
  Items that are hard items of the store, set from the beginning of the app.
**/

import { uNodeCreate } from './nodes/actions'

export default store => {
  store.dispatch(uNodeCreate('sceneCrossfader',
    {
      title: 'Scene Crossfader',
      id: 'sceneCrossfader',
      value: 0,
      type: 'param'
    }
  ))
}
