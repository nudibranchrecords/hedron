import { handleEachInput, HedronEngine, InputOptionNodesConfig, IPlugin } from '@hedron/engine'
import { bellCurve, clamp, lerp } from 'src/AudioUtils'
import * as THREE from 'three'
import { AudioDeviceManager } from './AudioDeviceManager'

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
 * Audio Input plugin for capturing and processing audio from the microphone
 * Provides frequency analysis and visualization capabilities
 */
export class AudioInput implements IPlugin {
  public static ID = 'audio-input'
  /**
   * Controls whether audio-related console logging is enabled
   * Set to false to disable all audio debug logs
   */
  public static ENABLE_LOGGING = false
  public readonly id = AudioInput.ID
  public readonly name = 'Audio Input'
  public readonly inputType = 'audio'
  public readonly description = 'README.md.'
  public readonly optionNodesConfig = [
    {
      key: 'isEnabled',
      valueType: 'boolean',
      defaultValue: true,
    },
    {
      key: 'frequency',
      valueType: 'enum',
      defaultValue: 1,
      options: [
        {
          value: 0,
          label: 'Low',
        },
        {
          value: 1,
          label: 'Mid Low',
        },
        {
          value: 2,
          label: 'Mid High',
        },
        {
          value: 3,
          label: 'High',
        },
      ],
    },
    {
      key: 'min',
      valueType: 'number',
      defaultValue: 0,
    },
    {
      key: 'max',
      valueType: 'number',
      defaultValue: 1,
    },
  ] as const satisfies InputOptionNodesConfig

  /**
   * Whether to generate a texture from audio data for visualization
   */
  public generateAudioTexture: boolean = true

  /**
   * Audio data containing the analyzer and visualization resources
   */
  public audioData: AudioData | undefined

  /**
   * Audio device manager that handles device selection and management
   */
  public deviceManager: AudioDeviceManager

  /**
   * Number of frequency bands to analyze
   */
  public readonly bandsCount: number = 4

  /**
   * Frequency band configurations with center frequencies and Q factors
   */
  public bands: FrequencyBand[] = [
    { centerFreq: 100, q: 1.0, color: BAND_COLORS[0] }, // Low
    { centerFreq: 400, q: 1.5, color: BAND_COLORS[1] }, // Mid Low
    { centerFreq: 1200, q: 2.0, color: BAND_COLORS[2] }, // Mid High
    { centerFreq: 4000, q: 2.5, color: BAND_COLORS[3] }, // High
  ]

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
   * How much to reduce the clean bins value each frame
   * Lower values create smoother release after sound peaks
   */
  public levelsFalloff: number = 1

  /**
   * Blends between raw volume and normalized result (0-1)
   * 0 = raw values, 1 = fully normalized
   */
  public normalizeLevels: number = 0

  /**
   * Smoothes out input changes over time (0-1)
   * Higher values create smoother transitions
   */
  public smoothing: number = 0

  /**
   * Applies exponential curve to levels, makes only loudest peaks stand out
   * Higher values emphasize peaks more dramatically
   */
  public levelsPower: number = 1

  /**
   * Gradually reduces max level values each frame
   * Helps adapt to quieter audio sections over time
   */
  public maxLevelFalloffMultiplier: number = 0.9999

  /**
   * Minimum value for max levels to prevent divide-by-zero errors
   */
  public maxLevelMinimum: number = 0.001

  /**
   * Whether band settings have been modified since last update
   */
  public bandsModified: boolean = false

  /**
   * Reference to the engine's state store
   */
  private _store

  /**
   * The last time debug information was logged
   */
  private _lastDebugTime: number = 0

  /**
   * Interval in milliseconds between debug logs
   */
  private _debugInterval: number = 2000 // Log every 2 seconds

  constructor(engine: HedronEngine) {
    console.log('[AudioInput] Plugin initializing...')
    this._store = engine.getStore()

    // Initialize audio device manager
    this.deviceManager = new AudioDeviceManager()
    AudioDeviceManager.ENABLE_LOGGING = AudioInput.ENABLE_LOGGING

    // Initialize audio capture
    this.deviceManager
      .updateInputDeviceList()
      .then(() => {
        return this.initAudio()
      })
      .then(() => {
        console.log('[AudioInput] Audio system successfully initialized')
        // Start the update loop when audio is ready
        window.requestAnimationFrame(() => this.update())
      })
      .catch((error) => {
        console.error('[AudioInput] Failed to initialize audio system:', error)
      })
  }

  /**
   * Updates a band's center frequency and Q factor
   * @param bandIndex Index of the band to update
   * @param centerFreq New center frequency (Hz)
   * @param q New Q factor
   */
  public updateBand(bandIndex: number, centerFreq: number, q: number): void {
    if (bandIndex < 0 || bandIndex >= this.bands.length) {
      console.error(`[AudioInput] Invalid band index: ${bandIndex}`)
      return
    }

    // Clamp frequency to valid range
    const clampedFreq = clamp(centerFreq, FREQ_RANGE.MIN, FREQ_RANGE.MAX)

    // Clamp Q to reasonable values
    const clampedQ = clamp(q, 0.1, 10.0)

    // Update band parameters
    this.bands[bandIndex].centerFreq = clampedFreq
    this.bands[bandIndex].q = clampedQ

    // Mark bands as modified
    this.bandsModified = true

    if (AudioInput.ENABLE_LOGGING)
      console.log(`[AudioInput] Band ${bandIndex} updated: Center=${clampedFreq}Hz, Q=${clampedQ}`)
  }

  /**
   * Updates the list of available audio input devices
   * @returns Promise with array of input devices
   */
  public async updateInputDeviceList(): Promise<MediaDeviceInfo[]> {
    return await this.deviceManager.updateInputDeviceList()
  }

  /**
   * Changes the active audio input device
   * @param deviceId ID of the device to use, 'default' uses system default
   * @returns Promise resolving when the device is changed
   */
  public async changeAudioInputDevice(deviceId: string): Promise<boolean> {
    try {
      const result = await this.deviceManager.changeAudioInputDevice(deviceId)

      if (result) {
        // Create a new audio stream with the selected device
        return await this.reinitializeAudio()
      }

      return false
    } catch (error) {
      console.error(`[AudioInput] Failed to change audio input device:`, error)
      return false
    }
  }

  /**
   * Reinitializes the audio system with current settings
   * Used when changing input devices
   */
  private async reinitializeAudio(): Promise<boolean> {
    try {
      // Reset state if we had previous data
      if (this.audioData) {
        // Reset levels data
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
      }

      // Initialize with new device
      await this.initAudio()
      return true
    } catch (error) {
      console.error('[AudioInput] Failed to reinitialize audio:', error)
      return false
    }
  }

  /**
   * Initializes the audio capture and analysis system
   * @returns Promise containing the audio data once initialized
   */
  public async initAudio(): Promise<AudioData> {
    try {
      if (AudioInput.ENABLE_LOGGING)
        console.log('[AudioInput] Initializing audio capture system...')

      // Update device list
      await this.updateInputDeviceList()

      // Get an audio stream using the device manager
      const stream = await this.deviceManager.getAudioStream()

      // Create audio context
      const context = new window.AudioContext()
      if (AudioInput.ENABLE_LOGGING) {
        console.log(
          `[AudioInput] Audio context created. Sample rate: ${context.sampleRate}Hz, State: ${context.state}`,
        )
      }

      // Create media stream source and analyzer
      const source = context.createMediaStreamSource(stream)
      const analyser = context.createAnalyser()

      // Log analyzer configuration
      if (AudioInput.ENABLE_LOGGING) {
        console.log('[AudioInput] Audio analyzer configuration:')
        console.log(`  - FFT Size: ${analyser.fftSize}`)
        console.log(`  - Frequency bin count: ${analyser.frequencyBinCount}`)
        console.log(`  - Min/Max decibels: ${analyser.minDecibels} to ${analyser.maxDecibels} dB`)
        console.log(`  - Smoothing time constant: ${analyser.smoothingTimeConstant}`)
      }

      // Create texture data array and initialize it
      const textureData = new Uint8Array(analyser.frequencyBinCount)
      for (let i = 0; i < textureData.length; i++) {
        textureData[i] = i
      }

      // Create frequency data array for analyzer
      const freqs = new Uint8Array(analyser.frequencyBinCount)

      // Initialize audio data structure
      this.audioData = {
        analyser,
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

      // Save sample rate for frequency calculations
      this.sampleRate = context.sampleRate
      this.nyquist = this.sampleRate / 2

      // Initialize data arrays for bands
      for (let i = 0; i < this.bandsCount; i++) {
        this.minLevelsData[i] = 0
        this.maxLevelsData[i] = this.maxLevelMinimum
        this.levelsData[i] = this.cleanLevelsData[i] = 0
      }

      // Initialize data arrays for full spectrum
      for (let i = 0; i < this.audioData.analyser.frequencyBinCount; i++) {
        this.fullMinLevelsData[i] = 0
        this.fullMaxLevelsData[i] = this.maxLevelMinimum
        this.fullLevelsData[i] = this.fullCleanLevelsData[i] = 0
      }

      // Connect the audio source to the analyzer
      source.connect(this.audioData.analyser)

      // Log frequency band information
      if (AudioInput.ENABLE_LOGGING) {
        console.log('[AudioInput] Frequency bands configuration:')
        console.log(`  - Frequency bin count: ${this.audioData.analyser.frequencyBinCount}`)
        console.log(`  - Sample rate: ${this.sampleRate}Hz, Nyquist: ${this.nyquist}Hz`)
        console.log(`  - ${this.bandsCount} bands with band-pass filter configuration`)
      }

      // Calculate frequency for each bin
      const binSize = this.nyquist / this.audioData.analyser.frequencyBinCount

      // Log band settings
      if (AudioInput.ENABLE_LOGGING) {
        console.log('[AudioInput] Band filter settings:')
        for (let i = 0; i < this.bands.length; i++) {
          const band = this.bands[i]
          console.log(
            `  - Band ${i + 1} (${['Low', 'Mid Low', 'Mid High', 'High'][i] || i}): ` +
              `Center: ${band.centerFreq}Hz, Q: ${band.q}, Color: ${band.color}`,
          )

          // Verify band frequency is within the audible range
          if (band.centerFreq < FREQ_RANGE.MIN || band.centerFreq > FREQ_RANGE.MAX) {
            console.warn(
              `[AudioInput] Band ${i + 1} center frequency (${band.centerFreq}Hz) is outside the recommended range (${FREQ_RANGE.MIN}-${FREQ_RANGE.MAX}Hz)`,
            )
          }
        }
      }

      return this.audioData
    } catch (error) {
      // Always log errors regardless of logging settings
      if (error instanceof DOMException) {
        switch (error.name) {
          case 'NotAllowedError':
            console.error('[AudioInput] Microphone access denied by user or system settings.')
            if (AudioInput.ENABLE_LOGGING) {
              console.log('[AudioInput] Troubleshooting tips:')
              console.log(
                '  - Check that you have granted microphone permissions in browser settings',
              )
              console.log('  - Ensure no other application is using the microphone exclusively')
              console.log('  - Try selecting a specific audio device if multiple are available')
            }
            break
          case 'NotFoundError':
            console.error('[AudioInput] No microphone detected on this device.')
            if (AudioInput.ENABLE_LOGGING) {
              console.log('[AudioInput] Troubleshooting tips:')
              console.log('  - Check if a microphone is properly connected')
              console.log('  - Try reconnecting your audio device')
            }
            break
          case 'NotReadableError':
            console.error('[AudioInput] Could not start audio capture. Hardware or OS error.')
            if (AudioInput.ENABLE_LOGGING) {
              console.log('[AudioInput] Troubleshooting tips:')
              console.log('  - Try reconnecting your audio device')
              console.log('  - Restart your browser or application')
              console.log('  - Check system audio settings')
            }
            break
          default:
            console.error(`[AudioInput] Error initializing audio: ${error.name}`, error)
        }
      } else {
        console.error('[AudioInput] Failed to initialize audio input:', error)
      }

      // Even when there's an error, log browser audio capabilities for debugging
      if (navigator.mediaDevices) {
        if (AudioInput.ENABLE_LOGGING) console.log('[AudioInput] Media devices API available')
      } else {
        console.error(
          '[AudioInput] Media devices API not available - microphone access not possible',
        )
      }

      if (typeof window.AudioContext !== 'undefined') {
        if (AudioInput.ENABLE_LOGGING) console.log('[AudioInput] AudioContext API available')
      } else {
        console.error('[AudioInput] AudioContext API not available - audio processing not possible')
      }

      throw error
    }
  }

  /**
   * Updates audio analysis on each frame
   * @param settings Configuration for audio processing
   * @returns The current levels data array
   */
  public update() {
    if (!this.audioData) return

    // Get latest frequency data from analyzer - using any to work around type issues with Uint8Array
    this.audioData.analyser.getByteFrequencyData(this.audioData.freqs as any)

    // Process the frequency bands
    this.processBands()

    this.processFullSpectrum()

    // Debug frequency data periodically
    if (AudioInput.ENABLE_LOGGING) {
      this.debugAudioLevels()
    }

    this.updateInputNodes()

    // Schedule next update
    window.requestAnimationFrame(() => this.update())

    return this.levelsData
  }

  /**
   * Updates sketch nodes based on current audio levels
   * Called each frame from the main update loop
   */
  private updateInputNodes() {
    const storeState = this._store.getState()
    handleEachInput<typeof this.optionNodesConfig>(
      storeState,
      this.inputType,
      ({ input, optionNodes, targetNode }) => {
        // TODO: This can be handled by `onInput` once we have `isEnabled` as a generic option
        if (!optionNodes.isEnabled) return
        if (targetNode.valueType !== 'number') return

        // If audio data is available, use the appropriate frequency band based on the option
        if (this.audioData && this.levelsData.length > 0) {
          const bandIndex = Math.min(optionNodes.frequency, this.bandsCount - 1)
          const audioValue = this.levelsData[bandIndex] || 0

          // Map the audio value to the configured min/max range
          storeState.updateNodeValue(
            input.targetNodeId,
            lerp(optionNodes.min, optionNodes.max, audioValue),
          )
        } else {
          // Fallback behavior when audio isn't initialized yet
          storeState.updateNodeValue(
            input.targetNodeId,
            lerp(optionNodes.min, optionNodes.max, optionNodes.frequency * 0.25),
          )
        }
      },
    )
  }

  private debugAudioLevels() {
    const currentTime = Date.now()
    if (currentTime - this._lastDebugTime < this._debugInterval) {
      return
    }
    this._lastDebugTime = currentTime

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

    console.log('[AudioInput] Current band levels:', bandsDebug)

    // Calculate overall audio level (average of all bands)
    const avgLevel = this.levelsData.reduce((sum, val) => sum + (val || 0), 0) / this.bands.length
    console.log(`[AudioInput] Average audio level: ${avgLevel.toFixed(3)}`)

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
          `[AudioInput] Peak frequency: ~${peakFreq}Hz (bin ${peakBin}) with magnitude ${peakValue.toFixed(3)}`,
        )
      }
    }

    // Log if bands were modified
    if (this.bandsModified) {
      console.log('[AudioInput] Band settings have been modified')
      this.bandsModified = false
    }
  }

  /**
   * Processes the full frequency spectrum for visualization
   * @param settings Audio processing configuration
   */
  private processFullSpectrum() {
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
    if (this.generateAudioTexture) {
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
  processBands() {
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
  getBandResponseCurve(bandIndex: number, resolution: number = 100): number[] {
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
}
