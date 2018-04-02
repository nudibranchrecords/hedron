import AudioAnalyzer from './AudioAnalyzer'
import { inputFired } from '../store/inputs/actions'
import { uNodeCreate } from '../store/nodes/actions'

export default (store) => {
  const gotStream = (stream) => {
    const input = new AudioAnalyzer(stream)
    const bandIds = ['audio_0', 'audio_1', 'audio_2', 'audio_3']

    store.dispatch(uNodeCreate('audioNormalizeLevels', {
      title: 'Normalize Levels',
      type: 'param',
      value: input.normalizeLevels,
      id: 'audioNormalizeLevels'
    }))

    store.dispatch(uNodeCreate('audioLevelsFalloff', {
      title: 'Levels Falloff',
      type: 'param',
      value: input.levelsFalloff,
      id: 'audioLevelsFalloff'
    }))

    let bands, i
    window.setInterval(() => {
      input.normalizeLevels = store.getState().nodes['audioNormalizeLevels'].value
      input.levelsFalloff = Math.pow(store.getState().nodes['audioLevelsFalloff'].value, 2)
      bands = input.update()
      for (i = 0; i < bands.length; i++) {
        store.dispatch(inputFired(bandIds[i], bands[i], { type: 'audio' }))
      }
    }, 30)
  }

  navigator.getUserMedia({
    audio: true
  }, gotStream, err => {
    console.error('The following error occured: ' + err.message)
  })
}
