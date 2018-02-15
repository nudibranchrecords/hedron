import AudioAnalyzer from './AudioAnalyzer'
import { inputFired } from '../store/inputs/actions'

export default (store) => {
  const gotStream = (stream) => {
    const input = new AudioAnalyzer(stream)
    const bandIds = ['audio_0', 'audio_1', 'audio_2', 'audio_3']

    let bands, i
    window.setInterval(() => {
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
