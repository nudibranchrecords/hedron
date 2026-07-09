import { handleEachInput, HedronEngine, IPlugin } from '@hedron-gl/engine'
import { AudioDeviceManager } from './AudioDeviceManager'
import { AudioAnalyzer, AudioData, FrequencyBand, BAND_COLORS } from './AudioAnalyzer'
import { lerp } from './AudioUtils'
import { handleAudioError } from './AudioTestUtils'

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
  public readonly iconName = 'mic'
  public readonly inputType = 'audio'
  public readonly description =
    'Captures microphone audio and provides real-time frequency analysis for visualization.'

  /**
   * Default frequency bands to use
   */
  private static DEFAULT_BANDS: FrequencyBand[] = [
    { centerFreq: 70, q: 0.2, color: BAND_COLORS[0] }, // Low
    { centerFreq: 400, q: 0.25, color: BAND_COLORS[1] }, // Mid Low
    { centerFreq: 1400, q: 0.3, color: BAND_COLORS[2] }, // Mid High
    { centerFreq: 5000, q: 0.33, color: BAND_COLORS[3] }, // High
  ]
  public readonly globalOptionNodesConfig = [
    {
      nodeType: 'param',
      key: 'masterVolume',
      title: 'Master Volume',
      valueType: 'number',
      defaultValue: 1.0,
      sliderMin: 0,
      sliderMax: 2.0,
    },
    {
      nodeType: 'param',
      key: 'smoothing',
      title: 'Smoothing',
      valueType: 'number',
      defaultValue: 0,
      sliderMin: 0,
      sliderMax: 0.999,
    },
    {
      nodeType: 'param',
      key: 'normalizeLevels',
      title: 'Normalize Levels',
      valueType: 'number',
      defaultValue: 0,
      sliderMin: 0,
      sliderMax: 1.0,
    },
    {
      nodeType: 'param',
      key: 'levelsFalloff',
      title: 'Levels Falloff',
      valueType: 'number',
      defaultValue: 1,
      sliderMin: 0,
      sliderMax: 2.0,
    },
    {
      nodeType: 'param',
      key: 'levelsPower',
      title: 'Levels Power',
      valueType: 'number',
      defaultValue: 1,
      sliderMin: 0.1,
      sliderMax: 5.0,
    },
    {
      nodeType: 'param',
      key: 'maxLevelFalloffMultiplier',
      title: 'Max Level Falloff Multiplier',
      valueType: 'number',
      defaultValue: 0.9999,
      sliderMin: 0.9,
      sliderMax: 1.0,
    },
    {
      nodeType: 'param',
      key: 'maxLevelMinimum',
      title: 'Max Level Minimum',
      valueType: 'number',
      defaultValue: 0.001,
      sliderMin: 0.0001,
      sliderMax: 0.1,
    },
    // Generate hidden band configuration nodes from DEFAULT_BANDS
    ...AudioInput.DEFAULT_BANDS.flatMap((band, index) => [
      {
        nodeType: 'param' as const,
        key: `band${index}CenterFreq`,
        title: `Band ${index} Center Frequency`,
        valueType: 'number' as const,
        defaultValue: band.centerFreq,
        hidden: true,
      },
      {
        nodeType: 'param' as const,
        key: `band${index}Q`,
        title: `Band ${index} Q Factor`,
        valueType: 'number' as const,
        defaultValue: band.q,
        hidden: true,
      },
    ]),
  ] as const satisfies IPlugin['globalOptionNodesConfig']

  public readonly optionNodesConfig = [
    {
      nodeType: 'param',
      key: 'isEnabled',
      title: 'Enabled',
      valueType: 'boolean',
      defaultValue: true,
    },
    {
      nodeType: 'param',
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
      nodeType: 'param',
      key: 'min',
      valueType: 'number',
      defaultValue: 0,
      title: 'Min Value',
      sliderMin: 0,
      sliderMax: 1,
    },
    {
      nodeType: 'param',
      key: 'max',
      valueType: 'number',
      defaultValue: 1,
      title: 'Max Value',
      sliderMin: 0,
      sliderMax: 1,
    },
  ] as const satisfies IPlugin['optionNodesConfig']

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
    // Sync band configurations once on initialization
    this.syncBandConfigurations()
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
   * Called after engine initialization to sync plugin state
   */
  public onEngineInitialize = (): void => {
    this.syncBandConfigurations()
  }

  /**
   * Updates a band's center frequency and Q factor
   * @param bandIndex Index of the band to update
   * @param centerFreq New center frequency (Hz)
   * @param q New Q factor
   */
  public updateBand(bandIndex: number, centerFreq: number, q: number): void {
    // Update the analyzer
    const result = this.analyzer.updateBand(bandIndex, centerFreq, q)
    if (!result) return

    // Update the store values so they persist
    const storeState = this._store.getState()
    const centerFreqNodeId = `${AudioInput.ID}-global-band${bandIndex}CenterFreq`
    const qNodeId = `${AudioInput.ID}-global-band${bandIndex}Q`

    // Only update store if the nodes exist
    if (storeState.nodes[centerFreqNodeId] && storeState.nodes[qNodeId]) {
      storeState.updateParamValue(centerFreqNodeId, result.clampedFreq)
      storeState.updateParamValue(qNodeId, result.clampedQ)
    }
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
      handleAudioError(error)
      throw error
    }
  }

  /**
   * Gets the master volume value from the global options
   * @returns Master volume value (default: 1.0)
   */
  private getMasterVolume(): number {
    const storeState = this._store.getState()
    // Construct the ID for the master volume node
    const masterVolumeNodeId = `${AudioInput.ID}-global-masterVolume`
    // Get the value from the store, default to 1.0 if not found
    const masterVolume = storeState.paramValues[masterVolumeNodeId] as number | undefined
    return masterVolume ?? 1.0
  }

  /**
   * Gets the smoothing value from the global options
   * @returns Smoothing value (default: 0)
   */
  private getSmoothing(): number {
    const storeState = this._store.getState()
    const nodeId = `${AudioInput.ID}-global-smoothing`
    const value = storeState.paramValues[nodeId] as number | undefined
    return value ?? 0
  }

  /**
   * Gets the normalize levels value from the global options
   * @returns Normalize levels value (default: 0)
   */
  private getNormalizeLevels(): number {
    const storeState = this._store.getState()
    const nodeId = `${AudioInput.ID}-global-normalizeLevels`
    const value = storeState.paramValues[nodeId] as number | undefined
    return value ?? 0
  }

  /**
   * Gets the levels falloff value from the global options
   * @returns Levels falloff value (default: 1)
   */
  private getLevelsFalloff(): number {
    const storeState = this._store.getState()
    const nodeId = `${AudioInput.ID}-global-levelsFalloff`
    const value = storeState.paramValues[nodeId] as number | undefined
    return value ?? 1
  }

  /**
   * Gets the levels power value from the global options
   * @returns Levels power value (default: 1)
   */
  private getLevelsPower(): number {
    const storeState = this._store.getState()
    const nodeId = `${AudioInput.ID}-global-levelsPower`
    const value = storeState.paramValues[nodeId] as number | undefined
    return value ?? 1
  }

  /**
   * Gets the max level falloff multiplier value from the global options
   * @returns Max level falloff multiplier value (default: 0.9999)
   */
  private getMaxLevelFalloffMultiplier(): number {
    const storeState = this._store.getState()
    const nodeId = `${AudioInput.ID}-global-maxLevelFalloffMultiplier`
    const value = storeState.paramValues[nodeId] as number | undefined
    return value ?? 0.9999
  }

  /**
   * Gets the max level minimum value from the global options
   * @returns Max level minimum value (default: 0.001)
   */
  private getMaxLevelMinimum(): number {
    const storeState = this._store.getState()
    const nodeId = `${AudioInput.ID}-global-maxLevelMinimum`
    const value = storeState.paramValues[nodeId] as number | undefined
    return value ?? 0.001
  }

  /**
   * Gets band configuration values from the store
   * @param bandIndex Index of the band (0-3)
   * @returns Object with centerFreq and q values
   */
  private getBandConfig(bandIndex: number): { centerFreq: number; q: number } {
    const storeState = this._store.getState()
    const centerFreqNodeId = `${AudioInput.ID}-global-band${bandIndex}CenterFreq`
    const qNodeId = `${AudioInput.ID}-global-band${bandIndex}Q`

    // Check if the nodes exist in the store first
    const centerFreqNode = storeState.nodes[centerFreqNodeId]
    const qNode = storeState.nodes[qNodeId]

    // If nodes don't exist (old project), use defaults
    if (!centerFreqNode || !qNode) {
      const defaults = AudioInput.DEFAULT_BANDS[bandIndex] || { centerFreq: 1000, q: 1 }
      return {
        centerFreq: defaults.centerFreq,
        q: defaults.q,
      }
    }

    const centerFreq = storeState.paramValues[centerFreqNodeId] as number | undefined
    const q = storeState.paramValues[qNodeId] as number | undefined

    // Return stored values or defaults
    const defaults = AudioInput.DEFAULT_BANDS[bandIndex] || { centerFreq: 1000, q: 1 }
    return {
      centerFreq: centerFreq ?? defaults.centerFreq,
      q: q ?? defaults.q,
    }
  }

  /**
   * Syncs band configurations from store to analyzer
   * Only syncs if all required nodes exist, otherwise leaves analyzer with defaults
   */
  private syncBandConfigurations(): void {
    const storeState = this._store.getState()

    // Check if any of the band configuration nodes exist
    let hasAnyBandNodes = false
    for (let i = 0; i < AudioInput.DEFAULT_BANDS.length; i++) {
      const centerFreqNodeId = `${AudioInput.ID}-global-band${i}CenterFreq`
      const qNodeId = `${AudioInput.ID}-global-band${i}Q`
      if (storeState.nodes[centerFreqNodeId] && storeState.nodes[qNodeId]) {
        hasAnyBandNodes = true
        break
      }
    }

    // If no band nodes exist (old project), don't sync - keep analyzer defaults
    if (!hasAnyBandNodes) {
      return
    }

    // Sync each band configuration
    for (let i = 0; i < AudioInput.DEFAULT_BANDS.length; i++) {
      const config = this.getBandConfig(i)
      this.analyzer.updateBand(i, config.centerFreq, config.q)
      if (AudioInput.ENABLE_LOGGING) {
        console.log(`[AudioInput] Synced band ${i}: ${config.centerFreq}Hz, Q=${config.q}`)
      }
    }
  }

  /**
   * Updates audio analysis on each frame
   * @returns The current levels data array
   */
  public update() {
    if (!this.audioData) return

    // Set all analyzer properties from global options
    this.analyzer.masterVolume = this.getMasterVolume()
    this.analyzer.smoothing = this.getSmoothing()
    this.analyzer.normalizeLevels = this.getNormalizeLevels()
    this.analyzer.levelsFalloff = this.getLevelsFalloff()
    this.analyzer.levelsPower = this.getLevelsPower()
    this.analyzer.maxLevelFalloffMultiplier = this.getMaxLevelFalloffMultiplier()
    this.analyzer.maxLevelMinimum = this.getMaxLevelMinimum()

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
        if (targetNode.nodeType === 'shot') return
        if (targetNode.valueType !== 'number') return

        // If audio data is available, use the appropriate frequency band based on the option
        if (this.audioData && this.analyzer.levelsData.length > 0) {
          const bandIndex = Math.min(optionNodes.frequency, this.analyzer.bandsCount - 1)
          // The master volume is already applied in the analyzer
          const audioValue = this.analyzer.levelsData[bandIndex] || 0

          const sliderMin =
            (storeState.paramValues[`${input.targetNodeId}-sliderMin`] as number) ?? 0
          const sliderMax =
            (storeState.paramValues[`${input.targetNodeId}-sliderMax`] as number) ?? 1

          // Map the audio value to the configured min/max range
          storeState.updateParamValue(
            input.targetNodeId,
            lerp(sliderMin, sliderMax, lerp(optionNodes.min, optionNodes.max, audioValue)),
          )
        } else {
          // Fallback behavior when audio isn't initialized yet
          storeState.updateParamValue(
            input.targetNodeId,
            lerp(optionNodes.min, optionNodes.max, optionNodes.frequency * 0.25),
          )
        }
      },
    )
  }
}
