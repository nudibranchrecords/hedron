import { handleEachInput, HedronEngine, InputOptionNodesConfig, IPlugin } from '@hedron/engine'
import { lerp } from 'src/AudioUtils'
import { AudioDeviceManager } from './AudioDeviceManager'
import { AudioAnalyzer, AudioData, FrequencyBand, BAND_COLORS } from './AudioAnalyzer'

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
   * Audio data containing the analyzer and visualization resources
   */
  public get audioData(): AudioData | undefined {
    return this.analyzer?.audioData
  }

  /**
   * Audio device manager that handles device selection and management
   */
  public deviceManager: AudioDeviceManager

  /**
   * Audio analyzer that processes audio data into frequency bands
   */
  public analyzer: AudioAnalyzer

  /**
   * Default frequency bands to use
   */
  private static DEFAULT_BANDS: FrequencyBand[] = [
    { centerFreq: 100, q: 1.0, color: BAND_COLORS[0] }, // Low
    { centerFreq: 400, q: 1.5, color: BAND_COLORS[1] }, // Mid Low
    { centerFreq: 1200, q: 2.0, color: BAND_COLORS[2] }, // Mid High
    { centerFreq: 4000, q: 2.5, color: BAND_COLORS[3] }, // High
  ]

  /**
   * Reference to the engine's state store
   */
  private _store

  constructor(engine: HedronEngine) {
    console.log('[AudioInput] Plugin initializing...')
    this._store = engine.getStore()

    // Initialize audio device manager
    this.deviceManager = new AudioDeviceManager()
    AudioDeviceManager.ENABLE_LOGGING = AudioInput.ENABLE_LOGGING

    // Initialize audio analyzer
    this.analyzer = new AudioAnalyzer(AudioInput.DEFAULT_BANDS)

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
    // Delegate to the analyzer
    this.analyzer.updateBand(bandIndex, centerFreq, q)
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
      // Reset analyzer data
      if (this.audioData) {
        this.analyzer.resetLevelsData()
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

      // Set up audio data in the analyzer
      const audioData = this.analyzer.setupAudioData(analyser, context.sampleRate)

      // Connect the audio source to the analyzer
      source.connect(analyser)

      return audioData
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
   * @returns The current levels data array
   */
  public update() {
    if (!this.audioData) return
    // Update the analyzer
    this.analyzer.update()
    // Update nodes based on new audio levels
    this.updateInputNodes()
    // Schedule next update
    window.requestAnimationFrame(() => this.update())
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
        if (!optionNodes.isEnabled) return
        if (targetNode.valueType !== 'number') return

        // If audio data is available, use the appropriate frequency band based on the option
        if (this.audioData && this.analyzer.levelsData.length > 0) {
          const bandIndex = Math.min(optionNodes.frequency, this.analyzer.bandsCount - 1)
          const audioValue = this.analyzer.levelsData[bandIndex] || 0

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
}
