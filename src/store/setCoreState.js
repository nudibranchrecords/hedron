/**
  Items that are hard items of the store, set from the beginning of the app.
**/

import { uNodeCreate } from './nodes/actions'

const coreNodes = [
  {
    title: 'Scene Crossfader',
    id: 'sceneCrossfader',
    value: 0,
    type: 'param',
    valueType: 'float',
  },
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
  },
  {
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
  },
  {
    title: 'Disable Error Popups',
    id: 'areErrorPopupsDisabled',
    valueType: 'boolean',
    value: false,
  },
  {
    title: 'Levels Falloff',
    type: 'param',
    value: 1,
    id: 'audioLevelsFalloff',
    valueType: 'float',
  },
  {
    title: 'Levels Power',
    type: 'param',
    value: 0.25,
    min: 0.5,
    max: 3,
    id: 'audioLevelsPower',
    valueType: 'float',
  },
  {
    title: 'Levels Smoothing',
    type: 'param',
    value: 0,
    id: 'audioLevelsSmoothing',
    valueType: 'float',
  },
  {
    title: 'Normalize Levels',
    type: 'param',
    value: 0.5,
    id: 'audioNormalizeLevels',
    valueType: 'float',
  },
  {
    title: 'Normalized Range Falloff',
    type: 'param',
    value: 0.01,
    id: 'audioNormalizeRangeFalloff',
    valueType: 'float',
  },
]

export default store => {
  coreNodes.forEach(node => {
    store.dispatch(uNodeCreate(node.id, node))
  })
}
