class AudioInput {
  constructor (stream) {
    const context = new window.AudioContext()
    const source = context.createMediaStreamSource(stream)

    this.numBands = 4

    this.analyser = context.createAnalyser()
    this.freqs = new Uint8Array(this.analyser.frequencyBinCount)

    this.levelsData = []

    source.connect(this.analyser)

    // Knocking off 500 redundant frequencies
    this.levelBins = Math.floor((this.analyser.frequencyBinCount - 500) / this.numBands)
  }

  update () {
    this.analyser.getByteFrequencyData(this.freqs)

    for (let i = 0; i < this.numBands; i++) {
      let sum = 0

      for (let j = 0; j < this.levelBins; j++) {
        sum += this.freqs[ (i * this.levelBins) + j ]
      }

      this.levelsData[ i ] = Math.round(((sum / this.levelBins) / 256) * 1000) / 1000
    }

    return this.levelsData
  }
}

export default AudioInput
