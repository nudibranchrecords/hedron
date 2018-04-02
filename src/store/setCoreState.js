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

  store.dispatch(uNodeCreate('viewerMode',
    {
      title: 'Viewer Mode',
      type: 'select',
      id: 'viewerMode',
      value: 'mix',
      inputLinkIds: [],
      options: [
        {
          value: 'mix',
          label: 'Mix'
        },
        {
          value: 'A',
          label: 'A'
        },
        {
          value: 'B',
          label: 'B'
        }
      ]
    }
  ))
}
