const THREE = require('three')
const EventEmitter = require('events')

class VideoTexture extends EventEmitter {
  constructor () {
    super()
    const constraints = { audio: false, video: true }
    this.video = document.createElement('video')
    this.video.width = 512
    this.video.height = 512
    this.video.autoplay = true

    this.success = this.success.bind(this)
    navigator.getUserMedia(constraints, this.success, this.fail)
  }

  success (stream) {
    this.video.src = URL.createObjectURL(stream)
    this.videoTexture = new THREE.VideoTexture(this.video)
    this.videoTexture.minFilter = THREE.LinearFilter
    this.videoTexture.magFilter = THREE.LinearFilter
    this.videoTexture.format = THREE.RGBFormat

    this.emit('got-feed', this.videoTexture)
  }

  fail (error) {
    console.error('cam failed', error)
  }
}

module.exports = new VideoTexture()
