import AudioAnalyzer from './AudioAnalyzer'
import { inputFired } from '../store/inputs/actions'

export default (store) => {
  const gotStream = (stream) => {
    const input = new AudioAnalyzer(stream)
    const bandIds = ['audio_0', 'audio_1', 'audio_2', 'audio_3']

    let bands, i
    window.setInterval(() => {
      let state = store.getState()
      input.normalizeLevels = state.nodes['audioNormalizeLevels'].value
      input.levelsFalloff = Math.pow(state.nodes['audioLevelsFalloff'].value, 2)
      input.maxLevelFalloffMultiplier = 1 - Math.pow(state.nodes['audioNormalizeRangeFalloff'].value, 3) * 0.01
      input.smoothing = state.nodes['audioLevelsSmoothing'].value * 0.99
      input.levelsPower = state.nodes['audioLevelsPower'].value * 3 + 0.5
      bands = input.update()
      for (i = 0; i < bands.length; i++) {
        store.dispatch(inputFired(bandIds[i], bands[i], { type: 'audio' }))
      }
    }, 30)
  }

  navigator.getUserMedia({
    audio: true,
  }, gotStream, err => {
    console.error('The following error occured: ' + err.message)
  })
}
