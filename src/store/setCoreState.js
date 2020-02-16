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
      type: 'param',
      valueType: 'float',
    }
  ))

  store.dispatch(uNodeCreate('viewerMode',
    {
      title: 'Viewer Mode',
      valueType: 'enum',
      id: 'viewerMode',
      value: 'mix',
      inputLinkIds: [],
      options: [
        {
          value: 'mix',
          label: 'Mix',
        },
        {
          value: 'A',
          label: 'A',
        },
        {
          value: 'B',
          label: 'B',
        },
      ],
    }
  ))

  store.dispatch(uNodeCreate('sketchOrganization', {
    title: 'Sketch Organization',
    valueType: 'enum',
    value: 'folder',
    id: 'sketchOrganization',
    options:[
      {
        value: 'folder',
        label: 'Folder',
      },
      {
        value: 'category',
        label: 'Category',
      },
      {
        value: 'author',
        label: 'Author',
      },
    ],
  }))

  store.dispatch(uNodeCreate('audioLevelsFalloff', {
    title: 'Levels Falloff',
    type: 'param',
    value: 1,
    id: 'audioLevelsFalloff',
    valueType: 'float',
  }))
  store.dispatch(uNodeCreate('audioLevelsPower', {
    title: 'Levels Power',
    type: 'param',
    value: 0.25,
    min: 0.5,
    max: 3,
    id: 'audioLevelsPower',
    valueType: 'float',
  }))
  store.dispatch(uNodeCreate('audioLevelsSmoothing', {
    title: 'Levels Smoothing',
    type: 'param',
    value: 0,
    id: 'audioLevelsSmoothing',
    valueType: 'float',
  }))

  store.dispatch(uNodeCreate('audioNormalizeLevels', {
    title: 'Normalize Levels',
    type: 'param',
    value: 0.5,
    id: 'audioNormalizeLevels',
    valueType: 'float',
  }))
  store.dispatch(uNodeCreate('audioNormalizeRangeFalloff', {
    title: 'Normalized Range Falloff',
    type: 'param',
    value: 0.01,
    id: 'audioNormalizeRangeFalloff',
    valueType: 'float',
  }))
}
