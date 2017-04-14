import AudioInput from './AudioInput'

const gotStream = (stream) => {
  const input = new AudioInput(stream)

  const loop = () => {
    console.log(input.update())
    requestAnimationFrame(loop)
  }
  loop()
}

navigator.getUserMedia({
  audio: true
}, gotStream, err => {
  console.error('The following error occured: ' + err.message)
})
