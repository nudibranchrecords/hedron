class AudioInput {
  constructor (stream) {
    const context = new window.AudioContext()
    const source = context.createMediaStreamSource(stream)

    this.numBands = 4

    this.analyser = context.createAnalyser()
    this.freqs = new Uint8Array(this.analyser.frequencyBinCount)

    this.levelsData = []
    this.cleanLevelsData = []                 //storing the levels data before normalization so we dont get errors when using a low falloff
    this.levelsFalloff = 1;                   //how much we reduce the clean bins value each frame, low numbers create a smoother release after sound bumps it up
    this.normalizeLevels = 0;                 //blends between the pure volume and a normalized result
    this.maxLevelsData = []                   //stores the highest value we have received for each bin
    this.maxLevelFalloffMultiplier = .9999    //shaving a small amount off the max value each frame in case of a rare peak, quieter song, etc
    this.maxLevelMinimum = .001               //stoping divide by zeros
    for (let i = 0; i < this.numBands; i++) {
      this.maxLevelsData[ i ] = this.maxLevelMinimum
      this.levelsData[ i ] = this.cleanLevelsData[ i ] = 0
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
      
      var band = (sum / this.levelBins) / 256
      band = Math.max(band, Math.max(0, this.cleanLevelsData[ i ] - this.levelsFalloff));
      this.cleanLevelsData[ i ] = band
      this.maxLevelsData[ i ] = Math.max(this.maxLevelsData[ i ] * this.maxLevelFalloffMultiplier, this.maxLevelMinimum)
      this.maxLevelsData[ i ] = Math.max(this.maxLevelsData[ i ], band)
      var normalized = band / this.maxLevelsData[ i ];
      this.levelsData[ i ] =  (1 - this.normalizeLevels) * band + this.normalizeLevels * normalized;
    }
    
    return this.levelsData
  }
}

export default AudioInput
