import { AudioInput } from 'src/AudioInput'
import { bellCurve, lerp } from 'src/AudioUtils'
import * as THREE from 'three'

/**
 * Represents a frequency band with center frequency and Q factor
 */
export interface FrequencyBand {
  /**
   * Center frequency in Hz
   */
  centerFreq: number

  /**
   * Q factor - higher values create narrower bands
   */
  q: number

  /**
   * Band color for visualization
   */
  color: string
}

/**
 * Frequency range limits for bands
 */
export const FREQ_RANGE = {
  MIN: 40, // Minimum frequency in Hz
  MAX: 10000, // Maximum frequency in Hz
}

/**
 * Default band colors for visualization
 */
export const BAND_COLORS = [
  '#FF5252', // Red
  '#FFEB3B', // Yellow
  '#4CAF50', // Green
  '#2196F3', // Blue
]

/**
 * Structure containing the audio analysis data and visualization resources
 */
export type AudioData = {
  /**
   * Web Audio API AnalyserNode for accessing audio frequency data
   */
  analyser: AnalyserNode
  /**
   * Raw frequency data from the audio input
   */
  freqs: Uint8Array
  /**
   * Processed audio data ready for texture creation
   */
  textureData: Uint8Array
  /**
   * THREE.js texture for visualizing the audio data
   */
  texture: THREE.DataTexture
}

/**
 * Settings for audio analysis configuration
 */
export type AudioAnalyzerSettings = {
  /**
   * Whether to generate a texture from audio data for visualization
   */
  generateAudioTexture: boolean

  /**
   * How much to reduce the clean bins value each frame
   * Lower values create smoother release after sound peaks
   */
  levelsFalloff: number

  /**
   * Blends between raw volume and normalized result (0-1)
   * 0 = raw values, 1 = fully normalized
   */
  normalizeLevels: number

  /**
   * Smoothes out input changes over time (0-1)
   * Higher values create smoother transitions
   */
  smoothing: number

  /**
   * Applies exponential curve to levels, makes only loudest peaks stand out
   * Higher values emphasize peaks more dramatically
   */
  levelsPower: number

  /**
   * Gradually reduces max level values each frame
   * Helps adapt to quieter audio sections over time
   */
  maxLevelFalloffMultiplier: number

  /**
   * Minimum value for max levels to prevent divide-by-zero errors
   */
  maxLevelMinimum: number
}

/**
 * AudioAnalyzer handles audio processing, frequency band analysis,
 * and spectrum visualization.
 */
export class AudioAnalyzer {
  /**
   * Audio data containing the analyzer and visualization resources
   */
  public audioData: AudioData | undefined

  /**
   * Master volume multiplier applied to all audio levels
   * Can be used to globally scale the audio response
   */
  public masterVolume: number = 1.0

  /**
   * Number of frequency bands to analyze
   */
  public readonly bandsCount: number

  /**
   * Frequency band configurations with center frequencies and Q factors
   */
  public bands: FrequencyBand[] = []

  /**
   * Sample rate from audio context (needed for frequency calculations)
   */
  public sampleRate: number = 44100

  /**
   * Nyquist frequency (half the sample rate)
   */
  public nyquist: number = 22050

  /**
   * Normalized and processed audio levels for each frequency band
   */
  public levelsData: number[] = []

  /**
   * Raw audio levels before normalization
   * Stored separately to avoid errors when using a low falloff
   */
  public cleanLevelsData: number[] = []

  /**
   * Maximum values recorded for each frequency band
   * Used for normalization
   */
  public maxLevelsData: number[] = []

  /**
   * Minimum values recorded for each frequency band
   * Used for normalization
   */
  public minLevelsData: number[] = []

  /**
   * Full spectrum data for all frequencies
   */
  public fullLevelsData: number[] = []

  /**
   * Raw full spectrum data before normalization
   */
  public fullCleanLevelsData: number[] = []

  /**
   * Maximum values for the full spectrum
   */
  public fullMaxLevelsData: number[] = []

  /**
   * Minimum values for the full spectrum
   */
  public fullMinLevelsData: number[] = []

  /**
   * Whether to generate a texture from audio data for visualization
   */
  public generateAudioTexture: boolean

  /**
   * How much to reduce the clean bins value each frame
   * Lower values create smoother release after sound peaks
   */
  public levelsFalloff: number

  /**
   * Blends between raw volume and normalized result (0-1)
   * 0 = raw values, 1 = fully normalized
   */
  public normalizeLevels: number

  /**
   * Smoothes out input changes over time (0-1)
   * Higher values create smoother transitions
   */
  public smoothing: number

  /**
   * Applies exponential curve to levels, makes only loudest peaks stand out
   * Higher values emphasize peaks more dramatically
   */
  public levelsPower: number

  /**
   * Gradually reduces max level values each frame
   * Helps adapt to quieter audio sections over time
   */
  public maxLevelFalloffMultiplier: number

  /**
   * Minimum value for max levels to prevent divide-by-zero errors
   */
  public maxLevelMinimum: number

  /**
   * Whether band settings have been modified since last update
   */
  public bandsModified: boolean = false

  /**
   * Create a new AudioAnalyzer
   *
   * @param bands Frequency band configurations
   * @param settings Analysis settings
   */
  constructor(bands: FrequencyBand[], settings?: Partial<AudioAnalyzerSettings>) {
    // Initialize bands
    this.bands = [...bands]
    this.bandsCount = this.bands.length

    // Apply settings with defaults
    const defaultSettings: AudioAnalyzerSettings = {
      generateAudioTexture: true,
      levelsFalloff: 1,
      normalizeLevels: 0,
      smoothing: 0,
      levelsPower: 1,
      maxLevelFalloffMultiplier: 0.9999,
      maxLevelMinimum: 0.001,
    }

    const mergedSettings = { ...defaultSettings, ...settings }
    this.generateAudioTexture = mergedSettings.generateAudioTexture
    this.levelsFalloff = mergedSettings.levelsFalloff
    this.normalizeLevels = mergedSettings.normalizeLevels
    this.smoothing = mergedSettings.smoothing
    this.levelsPower = mergedSettings.levelsPower
    this.maxLevelFalloffMultiplier = mergedSettings.maxLevelFalloffMultiplier
    this.maxLevelMinimum = mergedSettings.maxLevelMinimum

    // Initialize empty arrays for bands data
    for (let i = 0; i < this.bandsCount; i++) {
      this.minLevelsData[i] = 0
      this.maxLevelsData[i] = this.maxLevelMinimum
      this.levelsData[i] = this.cleanLevelsData[i] = 0
    }

    if (AudioInput.ENABLE_LOGGING) {
      console.log('[AudioAnalyzer] Initialized with', this.bandsCount, 'frequency bands')
    }
  }

  /**
   * Sets up the audio data for analysis
   * @param analyserNode Web Audio API AnalyserNode
   * @param sampleRate Sample rate from audio context
   * @returns The initialized AudioData object
   */
  public setupAudioData(analyserNode: AnalyserNode, sampleRate: number): AudioData {
    this.sampleRate = sampleRate
    this.nyquist = sampleRate / 2

    // Create texture data array and initialize it
    const textureData = new Uint8Array(analyserNode.frequencyBinCount)
    for (let i = 0; i < textureData.length; i++) {
      textureData[i] = i
    }

    // Create frequency data array for analyzer
    const freqs = new Uint8Array(analyserNode.frequencyBinCount)

    // Initialize audio data structure
    this.audioData = {
      analyser: analyserNode,
      freqs,
      textureData: textureData,
      texture: new THREE.DataTexture(
        textureData,
        textureData.length,
        1,
        THREE.RedFormat,
        THREE.UnsignedByteType,
      ),
    }

    // Configure texture properties
    const texture = this.audioData.texture
    texture.wrapS = THREE.ClampToEdgeWrapping
    texture.wrapT = THREE.ClampToEdgeWrapping
    texture.flipY = true
    texture.magFilter = THREE.LinearFilter
    texture.minFilter = THREE.LinearFilter
    texture.needsUpdate = true

    // Initialize data arrays for full spectrum
    for (let i = 0; i < analyserNode.frequencyBinCount; i++) {
      this.fullMinLevelsData[i] = 0
      this.fullMaxLevelsData[i] = this.maxLevelMinimum
      this.fullLevelsData[i] = this.fullCleanLevelsData[i] = 0
    }

    if (AudioInput.ENABLE_LOGGING) {
      console.log('[AudioAnalyzer] Audio data setup complete')
      console.log(`  - Sample rate: ${this.sampleRate}Hz, Nyquist: ${this.nyquist}Hz`)
      console.log(`  - Frequency bin count: ${analyserNode.frequencyBinCount}`)
    }

    return this.audioData
  }

  /**
   * Reset all audio level data
   * Useful when changing audio devices or when needing a clean start
   */
  public resetLevelsData(): void {
    if (!this.audioData) return

    // Reset levels data for bands
    for (let i = 0; i < this.bandsCount; i++) {
      this.minLevelsData[i] = 0
      this.maxLevelsData[i] = this.maxLevelMinimum
      this.levelsData[i] = this.cleanLevelsData[i] = 0
    }

    // Reset full spectrum data
    const binCount = this.audioData.analyser.frequencyBinCount
    for (let i = 0; i < binCount; i++) {
      this.fullMinLevelsData[i] = 0
      this.fullMaxLevelsData[i] = this.maxLevelMinimum
      this.fullLevelsData[i] = this.fullCleanLevelsData[i] = 0
    }

    if (AudioInput.ENABLE_LOGGING) {
      console.log('[AudioAnalyzer] Audio levels data reset')
    }
  }

  /**
   * Updates a band's center frequency and Q factor
   * @param bandIndex Index of the band to update
   * @param centerFreq New center frequency (Hz)
   * @param q New Q factor
   */
  public updateBand(bandIndex: number, centerFreq: number, q: number): void {
    if (bandIndex < 0 || bandIndex >= this.bands.length) {
      console.error(`[AudioAnalyzer] Invalid band index: ${bandIndex}`)
      return
    }

    // Clamp frequency to valid range
    const clampedFreq = Math.max(FREQ_RANGE.MIN, Math.min(FREQ_RANGE.MAX, centerFreq))

    // Clamp Q to reasonable values
    const clampedQ = Math.max(0.1, Math.min(10.0, q))

    // Update band parameters
    this.bands[bandIndex].centerFreq = clampedFreq
    this.bands[bandIndex].q = clampedQ

    // Mark bands as modified
    this.bandsModified = true

    if (AudioInput.ENABLE_LOGGING) {
      console.log(
        `[AudioAnalyzer] Band ${bandIndex} updated: Center=${clampedFreq}Hz, Q=${clampedQ}`,
      )
    }
  }

  /**
   * Updates audio analysis on each frame
   * @returns The current levels data array
   */
  public update(): void {
    if (!this.audioData) return
    // Get latest frequency data from analyzer - using any to work around type issues with Uint8Array
    this.audioData.analyser.getByteFrequencyData(this.audioData.freqs as any)
    // Process the frequency bands
    this.processBands()
    // Process the full spectrum
    this.processFullSpectrum()
  }

  /**
   * Processes the full frequency spectrum for visualization
   */
  private processFullSpectrum(): void {
    if (!this.audioData) return

    // Process each frequency in the spectrum
    for (let i = 0; i < this.audioData.freqs.length; i++) {
      // Normalize to 0-1 range
      let freq = this.audioData.freqs[i] / 256

      // Apply falloff to create smoother transitions
      freq = Math.max(freq, Math.max(0, this.fullCleanLevelsData[i] - this.levelsFalloff))
      this.fullCleanLevelsData[i] = freq

      // Update min/max values with falloff
      this.fullMaxLevelsData[i] = Math.max(
        this.fullMaxLevelsData[i] * this.maxLevelFalloffMultiplier,
        this.maxLevelMinimum,
      )
      this.fullMinLevelsData[i] = Math.min(
        1 - (1 - this.fullMinLevelsData[i]) * this.maxLevelFalloffMultiplier,
        this.fullMaxLevelsData[i] - this.maxLevelMinimum,
      )

      // Update range boundaries
      this.fullMaxLevelsData[i] = Math.max(this.fullMaxLevelsData[i], freq)
      this.fullMinLevelsData[i] = Math.min(this.fullMinLevelsData[i], freq)

      // Calculate normalized value within the dynamic range
      const normalized =
        (freq - this.fullMinLevelsData[i]) / (this.fullMaxLevelsData[i] - this.fullMinLevelsData[i])

      // Blend between raw and normalized values
      freq = lerp(freq, normalized, this.normalizeLevels)

      // Apply exponential curve for emphasis
      freq = Math.pow(freq, this.levelsPower)

      // Apply smoothing between frames
      this.fullLevelsData[i] = lerp(freq, this.fullLevelsData[i], this.smoothing)
    }

    // Update visualization texture if requested
    if (this.generateAudioTexture && this.audioData) {
      for (let i = 0; i < this.audioData.freqs.length; i++) {
        this.audioData.textureData[i] = Math.floor(this.fullLevelsData[i] * 256)
      }
      this.audioData.texture.needsUpdate = true
    }
  }

  /**
   * Processes audio data into frequency bands using band-pass filters
   * Applies a bell curve filter to the frequency spectrum for each band
   */
  private processBands(): void {
    if (!this.audioData) return

    const binCount = this.audioData.freqs.length
    const binSize = this.nyquist / binCount

    // Process each frequency band
    for (let bandIndex = 0; bandIndex < this.bands.length; bandIndex++) {
      const band = this.bands[bandIndex]
      let sum = 0
      let totalWeight = 0

      // Apply band-pass filter to each frequency bin
      for (let i = 0; i < binCount; i++) {
        // Calculate the frequency for this bin
        const frequency = i * binSize

        // Skip frequencies outside our range of interest
        if (frequency < FREQ_RANGE.MIN || frequency > FREQ_RANGE.MAX) continue

        // Calculate weight using bell curve function
        const weight = bellCurve(frequency, band.centerFreq, band.q)

        // Skip negligible weights for performance
        if (weight < 0.01) continue

        // Apply weight to the frequency bin value
        const value = this.audioData.freqs[i] / 256 // Normalize to 0-1
        sum += value * weight
        totalWeight += weight
      }

      // Calculate weighted average
      let bandValue = totalWeight > 0 ? sum / totalWeight : 0

      // Apply falloff for smoother transitions
      bandValue = Math.max(
        bandValue,
        Math.max(0, this.cleanLevelsData[bandIndex] - this.levelsFalloff),
      )
      this.cleanLevelsData[bandIndex] = bandValue

      // Update min/max values with falloff
      this.maxLevelsData[bandIndex] = Math.max(
        this.maxLevelsData[bandIndex] * this.maxLevelFalloffMultiplier,
        this.maxLevelMinimum,
      )
      this.maxLevelsData[bandIndex] = Math.max(this.maxLevelsData[bandIndex], bandValue)

      this.minLevelsData[bandIndex] = Math.min(
        1 - (1 - this.minLevelsData[bandIndex]) * this.maxLevelFalloffMultiplier,
        this.maxLevelsData[bandIndex] - this.maxLevelMinimum,
      )
      this.minLevelsData[bandIndex] = Math.min(this.minLevelsData[bandIndex], bandValue)

      // Calculate normalized value
      const normalized =
        (bandValue - this.minLevelsData[bandIndex]) /
        (this.maxLevelsData[bandIndex] - this.minLevelsData[bandIndex])

      // Blend between raw and normalized values
      bandValue = lerp(bandValue, normalized, this.normalizeLevels)

      // Apply exponential curve for emphasis
      bandValue = Math.pow(bandValue, this.levelsPower)

      // Apply master volume
      bandValue = bandValue * this.masterVolume

      // Apply smoothing between frames
      this.levelsData[bandIndex] = lerp(bandValue, this.levelsData[bandIndex], this.smoothing)
    }
  }

  /**
   * Gets the band response curve for visualization
   * @param bandIndex Index of the band to get curve for
   * @param resolution Number of points in the curve
   * @returns Array of points representing the curve (0-1 normalized)
   */
  public getBandResponseCurve(bandIndex: number, resolution: number = 100): number[] {
    if (bandIndex < 0 || bandIndex >= this.bands.length) {
      return Array(resolution).fill(0)
    }

    const band = this.bands[bandIndex]
    const curve: number[] = []

    // Generate logarithmically spaced points across frequency range
    for (let i = 0; i < resolution; i++) {
      // Use logarithmic scale for frequency (more natural for audio)
      const t = i / (resolution - 1)
      const freq = FREQ_RANGE.MIN * Math.pow(FREQ_RANGE.MAX / FREQ_RANGE.MIN, t)
      const response = bellCurve(freq, band.centerFreq, band.q)
      curve.push(response)
    }

    return curve
  }

  /**
   * Log debug information about the audio analyzer
   */
  public logDebugInfo(): void {
    if (!AudioInput.ENABLE_LOGGING) return

    // Log the levels data for each frequency band
    const bandsDebug = this.bands.map((band, i) => {
      const level = this.levelsData[i]?.toFixed(3) || 'N/A'

      // Get range covered by this band (where response > 0.5)
      let lowerBound = 0
      let upperBound = 0

      // Calculate approximate bandwidth based on Q
      // For a bell curve, bandwidth at half power points (-3dB) is approximately center/Q
      const bandwidth = band.centerFreq / band.q
      lowerBound = Math.max(FREQ_RANGE.MIN, band.centerFreq - bandwidth / 2)
      upperBound = Math.min(FREQ_RANGE.MAX, band.centerFreq + bandwidth / 2)

      return {
        name: ['Low', 'Mid Low', 'Mid High', 'High'][i] || `Band ${i + 1}`,
        centerFreq: `${Math.round(band.centerFreq)}Hz`,
        q: band.q.toFixed(1),
        bandwidth: `${Math.round(bandwidth)}Hz`,
        range: `${Math.round(lowerBound)}-${Math.round(upperBound)}Hz`,
        level,
      }
    })

    console.log('[AudioAnalyzer] Current band levels:', bandsDebug)

    // Calculate overall audio level (average of all bands)
    const avgLevel = this.levelsData.reduce((sum, val) => sum + (val || 0), 0) / this.bands.length
    console.log(`[AudioAnalyzer] Average audio level: ${avgLevel.toFixed(3)}`)

    // Find peak bin in full spectrum if available
    if (this.fullLevelsData && this.fullLevelsData.length > 0) {
      let peakBin = 0
      let peakValue = 0

      for (let i = 0; i < this.fullLevelsData.length; i++) {
        if (this.fullLevelsData[i] > peakValue) {
          peakValue = this.fullLevelsData[i]
          peakBin = i
        }
      }

      // Convert peak bin to frequency
      const peakFreq = Math.round((peakBin / this.fullLevelsData.length) * this.nyquist)
      if (peakValue > 0.1) {
        console.log(
          `[AudioAnalyzer] Peak frequency: ~${peakFreq}Hz (bin ${peakBin}) with magnitude ${peakValue.toFixed(3)}`,
        )
      }
    }

    // Log if bands were modified
    if (this.bandsModified) {
      console.log('[AudioAnalyzer] Band settings have been modified')
      this.bandsModified = false
    }
  }
}
