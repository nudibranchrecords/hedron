import * as THREE from 'three'

export type AudioSettings = {
  computeFullSpectrum: boolean
  generateAudioTexture: boolean
}

export type AudioData = {
  analyser: AnalyserNode
  freqs: Uint8Array
  textureData: Uint8Array
  texture: THREE.DataTexture
}

export class AudioAnalyser {
  public audioData: AudioData | undefined

  public bands: number = 4
  public levelsData: number[] = []
  // storing the levels data before normalization so we dont get errors when using a low falloff
  public cleanLevelsData: number[] = []
  // how much we reduce the clean bins value each frame, low numbers create a smoother release after sound bumps it up
  // stores the highest value we have received for each bin
  public maxLevelsData: number[] = []
  public minLevelsData: number[] = []
  public fullLevelsData: number[] = []
  public fullCleanLevelsData: number[] = []
  public fullMaxLevelsData: number[] = []
  public fullMinLevelsData: number[] = []
  public levelsFalloff: number = 1
  // blends between the pure volume and a normalized result
  public normalizeLevels: number = 0
  // smoothes out the input
  public smoothing: number = 0
  // applies a level of exponentiality to the levels, make only the loudest peaks pop
  public levelsPower: number = 1
  // shaving a small amount off the max levels value each frame in case of a rare peak, quieter song, etc
  public maxLevelFalloffMultiplier: number = 0.9999
  // stoping divide by zeros
  public maxLevelMinimum: number = 0.001
  public levelBins: number = 0

  constructor() {}

  public async init(): Promise<AudioData> {
    const stream: MediaStream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const context = new window.AudioContext()
    const source = context.createMediaStreamSource(stream)
    const analyser = context.createAnalyser()
    const textureData = new Uint8Array(analyser.frequencyBinCount)
    for (let i = 0; i < textureData.length; i++) {
      textureData[i] = i
    }
    //init textureData
    this.audioData = {
      analyser,
      freqs: new Uint8Array(analyser.frequencyBinCount),
      textureData: textureData,
      texture: new THREE.DataTexture(
        textureData,
        textureData.length,
        1,
        THREE.RedFormat,
        THREE.UnsignedByteType,
      ),
    }
    const texture = this.audioData.texture
    texture.wrapS = THREE.ClampToEdgeWrapping
    texture.wrapT = THREE.ClampToEdgeWrapping
    texture.flipY = true
    texture.magFilter = THREE.LinearFilter
    texture.minFilter = THREE.LinearFilter
    texture.needsUpdate = true

    for (let i = 0; i < this.bands; i++) {
      this.minLevelsData[i] = 0
      this.maxLevelsData[i] = this.maxLevelMinimum
      this.levelsData[i] = this.cleanLevelsData[i] = 0
    }
    for (let i = 0; i < this.audioData.analyser.frequencyBinCount; i++) {
      this.fullMinLevelsData[i] = 0
      this.fullMaxLevelsData[i] = this.maxLevelMinimum
      this.fullLevelsData[i] = this.fullCleanLevelsData[i] = 0
    }

    source.connect(this.audioData.analyser)

    // Knocking off 500 redundant frequencies
    this.levelBins = Math.floor((this.audioData.analyser.frequencyBinCount - 500) / this.bands)

    // update loop
    window.requestAnimationFrame(() =>
      this.update({ computeFullSpectrum: true, generateAudioTexture: true }),
    )

    return this.audioData
  }

  lerp(v0: number, v1: number, t: number) {
    return (1 - t) * v0 + t * v1
  }

  public update(settings: AudioSettings) {
    if (!this.audioData) return

    this.audioData.analyser.getByteFrequencyData(this.audioData.freqs)
    this.processBands()
    if (settings.computeFullSpectrum) {
      this.processFullSpectrum(settings)
    }
    window.requestAnimationFrame(() => this.update(settings))
    return this.levelsData
  }

  private processFullSpectrum(settings: AudioSettings) {
    if (!this.audioData) return
    for (let i = 0; i < this.audioData.freqs.length; i++) {
      let freq = this.audioData.freqs[i] / 256
      freq = Math.max(freq, Math.max(0, this.fullCleanLevelsData[i] - this.levelsFalloff))
      this.fullCleanLevelsData[i] = freq

      this.fullMaxLevelsData[i] = Math.max(
        this.fullMaxLevelsData[i] * this.maxLevelFalloffMultiplier,
        this.maxLevelMinimum,
      )
      this.fullMinLevelsData[i] = Math.min(
        1 - (1 - this.fullMinLevelsData[i]) * this.maxLevelFalloffMultiplier,
        this.fullMaxLevelsData[i] - this.maxLevelMinimum,
      )
      this.fullMaxLevelsData[i] = Math.max(this.fullMaxLevelsData[i], freq)
      this.fullMinLevelsData[i] = Math.min(this.fullMinLevelsData[i], freq)
      let normalized =
        (freq - this.fullMinLevelsData[i]) / (this.fullMaxLevelsData[i] - this.fullMinLevelsData[i])
      freq = this.lerp(freq, normalized, this.normalizeLevels)
      freq = Math.pow(freq, this.levelsPower)
      this.fullLevelsData[i] = this.lerp(freq, this.fullLevelsData[i], this.smoothing)
    }

    if (settings.generateAudioTexture) {
      for (let i = 0; i < this.audioData.freqs.length; i++) {
        this.audioData.textureData[i] = Math.floor(this.fullLevelsData[i] * 256)
      }
      this.audioData.texture.needsUpdate = true
    }
  }

  processBands() {
    if (!this.audioData) return
    for (let i = 0; i < this.bands; i++) {
      let sum = 0

      for (let j = 0; j < this.levelBins; j++) {
        sum += this.audioData.freqs[i * this.levelBins + j]
      }
      let band = sum / this.levelBins / 256
      band = Math.max(band, Math.max(0, this.cleanLevelsData[i] - this.levelsFalloff))
      this.cleanLevelsData[i] = band
      this.maxLevelsData[i] = Math.max(
        this.maxLevelsData[i] * this.maxLevelFalloffMultiplier,
        this.maxLevelMinimum,
      )
      this.maxLevelsData[i] = Math.max(this.maxLevelsData[i], band)
      this.minLevelsData[i] = Math.min(
        1 - (1 - this.minLevelsData[i]) * this.maxLevelFalloffMultiplier,
        this.maxLevelsData[i] - this.maxLevelMinimum,
      )
      this.minLevelsData[i] = Math.min(this.minLevelsData[i], band)
      const normalized =
        (band - this.minLevelsData[i]) / (this.maxLevelsData[i] - this.minLevelsData[i])
      band = this.lerp(band, normalized, this.normalizeLevels)
      band = Math.pow(band, this.levelsPower)
      this.levelsData[i] = this.lerp(band, this.levelsData[i], this.smoothing)
    }
  }
}
