import * as THREE from 'three'
import { settingsUpdate } from '../store/settings/actions'

let generateAudioTexture = false, computeFullSpectrum = false;

export class AudioAnalyzer {
  constructor(stream) {
    const context = new window.AudioContext()
    const source = context.createMediaStreamSource(stream)

    this.numBands = 4

    this.analyser = context.createAnalyser()
    this.freqs = new Uint8Array(this.analyser.frequencyBinCount)

    this.levelsData = []
    // storing the levels data before normalization so we dont get errors when using a low falloff
    this.cleanLevelsData = []
    // how much we reduce the clean bins value each frame, low numbers create a smoother release after sound bumps it up
    // stores the highest value we have received for each bin
    this.maxLevelsData = []
    this.minLevelsData = []

    this.fullLevelsData = []
    this.fullCleanLevelsData = []
    this.fullMaxLevelsData = []
    this.fullMinLevelsData = []
    this.textureData = new Uint8Array(this.analyser.frequencyBinCount)

    this.levelsFalloff = 1
    // blends between the pure volume and a normalized result
    this.normalizeLevels = 0
    // smoothes out the input
    this.smoothing = 0
    // applies a level of exponentiality to the levels, make only the loudest peaks pop
    this.levelsPower = 1
    // shaving a small amount off the max levels value each frame in case of a rare peak, quieter song, etc
    this.maxLevelFalloffMultiplier = 0.9999
    // stoping divide by zeros
    this.maxLevelMinimum = 0.001
    for (let i = 0; i < this.numBands; i++) {
      this.minLevelsData[i] = 0
      this.maxLevelsData[i] = this.maxLevelMinimum
      this.levelsData[i] = this.cleanLevelsData[i] = 0
    }
    for (let i = 0; i < this.analyser.frequencyBinCount; i++) {
      this.fullMinLevelsData[i] = 0
      this.fullMaxLevelsData[i] = this.maxLevelMinimum
      this.fullLevelsData[i] = this.fullCleanLevelsData[i] = 0
    }

    source.connect(this.analyser)

    // Knocking off 500 redundant frequencies
    this.levelBins = Math.floor((this.analyser.frequencyBinCount - 500) / this.numBands)

    // creating audio texture
    this.texture = new THREE.DataTexture(self.data, this.analyser.frequencyBinCount, 1, THREE.LuminanceFormat)
    this.texture.magFilter = this.texture.minFilter = THREE.LinearFilter
  }

  lerp(v0, v1, t) {
    return (1 - t) * v0 + t * v1
  }

  update() {
    // console.log(generateAudioTexture)
    this.analyser.getByteFrequencyData(this.freqs)
    this.processBands()
    if (computeFullSpectrum) {
      this.processFullSpectrum()
    }
    return this.levelsData
  }

  processFullSpectrum() {
    for (let i = 0; i < this.freqs.length; i++) {
      let freq = this.freqs[i] / 256
      freq = Math.max(freq, Math.max(0, this.fullCleanLevelsData[i] - this.levelsFalloff))
      this.fullCleanLevelsData[i] = freq

      this.fullMaxLevelsData[i] = Math.max(
        this.fullMaxLevelsData[i] * this.maxLevelFalloffMultiplier,
        this.maxLevelMinimum)
      this.fullMinLevelsData[i] = Math.min(
        1 - (1 - this.fullMinLevelsData[i]) * this.maxLevelFalloffMultiplier,
        this.fullMaxLevelsData[i] - this.maxLevelMinimum)
      this.fullMaxLevelsData[i] = Math.max(this.fullMaxLevelsData[i], freq)
      this.fullMinLevelsData[i] = Math.min(this.fullMinLevelsData[i], freq)
      let normalized = (freq - this.fullMinLevelsData[i]) /
        (this.fullMaxLevelsData[i] - this.fullMinLevelsData[i])
      freq = this.lerp(freq, normalized, this.normalizeLevels)
      freq = Math.pow(freq, this.levelsPower)
      this.fullLevelsData[i] = this.lerp(freq, this.fullLevelsData[i], this.smoothing)
    }

    if (generateAudioTexture) {
      for (let i = 0; i < this.freqs.length; i++) {
        this.textureData[i] = Math.floor(this.fullLevelsData[i] * 256)
      }
      this.texture.image.data = this.textureData
      this.texture.needsUpdate = true
    }
  }

  processBands() {
    for (let i = 0; i < this.numBands; i++) {
      let sum = 0

      for (let j = 0; j < this.levelBins; j++) {
        sum += this.freqs[(i * this.levelBins) + j]
      }
      let band = (sum / this.levelBins) / 256
      band = Math.max(band, Math.max(0, this.cleanLevelsData[i] - this.levelsFalloff))
      this.cleanLevelsData[i] = band
      this.maxLevelsData[i] = Math.max(this.maxLevelsData[i] * this.maxLevelFalloffMultiplier, this.maxLevelMinimum)
      this.maxLevelsData[i] = Math.max(this.maxLevelsData[i], band)
      this.minLevelsData[i] = Math.min(
        1 - (1 - this.minLevelsData[i]) * this.maxLevelFalloffMultiplier,
        this.maxLevelsData[i] - this.maxLevelMinimum)
      this.minLevelsData[i] = Math.min(this.minLevelsData[i], band)
      const normalized = (band - this.minLevelsData[i]) / (this.maxLevelsData[i] - this.minLevelsData[i])
      band = this.lerp(band, normalized, this.normalizeLevels)
      band = Math.pow(band, this.levelsPower)
      this.levelsData[i] = this.lerp(band, this.levelsData[i], this.smoothing)
    }
  }
}

export const listener = (action, store) => {
  if (action.type == 'SETTINGS_UPDATE') {
    let items = null
    const c = action.payload.items.computeFullSpectrum
    const g = action.payload.items.generateAudioTexture;
    if (c != undefined && c != computeFullSpectrum) {
      computeFullSpectrum = c
      if (generateAudioTexture && !computeFullSpectrum) {
        items = { generateAudioTexture: false }
      }
    }

    if (g != undefined && g != generateAudioTexture) {
      generateAudioTexture = g
      if (generateAudioTexture && !computeFullSpectrum) {
        items = { computeFullSpectrum: true }
      }
    }

    if (items) {
      store.dispatch(settingsUpdate(items))
    }
  }
}
