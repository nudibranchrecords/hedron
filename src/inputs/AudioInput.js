import AudioAnalyzer from './AudioAnalyzer'
import { inputFired } from '../store/inputs/actions'

export default (store) => {
  const gotStream = (stream) => {
    const input = new AudioAnalyzer(stream)

    const loop = () => {
      const bands = input.update()
      bands.forEach((val, index) => {
        store.dispatch(inputFired('audio_' + index, val))
      })
      requestAnimationFrame(loop)
    }
    loop()
  }

  navigator.getUserMedia({
    audio: true
  }, gotStream, err => {
    console.error('The following error occured: ' + err.message)
  })
}
