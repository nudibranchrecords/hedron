class AudioInput {
  constructor (stream) {
    const context = new window.AudioContext()
    const source = context.createMediaStreamSource(stream)

    this.numBands = 4

    this.analyser = context.createAnalyser()
    this.freqs = new Uint8Array(this.analyser.frequencyBinCount)

    this.levelsData = []
    this.maxLevelsData = []
    this.maxLevelFalloff = .9999
    this.maxLevelMinimum = .001
    for (let i = 0; i < this.numBands; i++) {
      this.maxLevelsData[ i ] = this.maxLevelMinimum
    }

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
      
      this.levelsData[ i ] = (sum / this.levelBins) / 256
      this.maxLevelsData[ i ] = Math.max(this.maxLevelsData[ i ] * this.maxLevelFalloff, this.maxLevelMinimum)
      this.maxLevelsData[ i ] = Math.max(this.maxLevelsData[ i ], this.levelsData[ i ])
      this.levelsData[ i ] = this.levelsData[ i ] / this.maxLevelsData[ i ];      
    }

    return this.levelsData
  }
}

export default AudioInput
