import {
  defineOptionNodeConfigs,
  EngineStore,
  handleEachInput,
  HedronEngine,
  InputNode,
  IPlugin,
  OptionNodesFromConfigs,
} from '@hedron-gl/engine'
import { AudioDeviceManager } from './AudioDeviceManager'
import {
  AudioAnalyzer,
  AudioData,
  FrequencyBand,
  BAND_COLORS,
  DEFAULT_MIN_DECIBELS,
  DEFAULT_MAX_DECIBELS,
} from './AudioAnalyzer'
import { lerp, computePeakAmplitude, gainForPeak } from './AudioUtils'
import { handleAudioError } from './AudioTestUtils'
import { analyzeAudioOffline } from './OfflineSpectrumAnalyzer'
import { AUDIO_INPUT_NODE_ID } from './constants'

/** Target peak amplitude for peak-normalized (auto) gain - a touch under full scale for headroom. */
const TARGET_PEAK_AMPLITUDE = 0.99

export interface BeginOfflineAnalysisOptions {
  /** URL of the audio resource to analyze (e.g. the timeline's audio resource, resolved). */
  url: string
  /** Frames per second of the render this analysis is being computed for. */
  fps: number
  /** Total number of frames to precompute (should match the render's frame count). */
  frameCount: number
  /** Timeline offset of the first analysis row. Defaults to 0. */
  startSeconds?: number
  /** Returns the current playhead position, in milliseconds, for the frame being rendered. */
  getTimeMs: () => number
}

/**
 * Default frequency bands to use
 */
const DEFAULT_BANDS: FrequencyBand[] = [
  { centerFreq: 70, q: 0.2, color: BAND_COLORS[0] }, // Low
  { centerFreq: 400, q: 0.25, color: BAND_COLORS[1] }, // Mid Low
  { centerFreq: 1400, q: 0.3, color: BAND_COLORS[2] }, // Mid High
  { centerFreq: 5000, q: 0.33, color: BAND_COLORS[3] }, // High
]

const getBandCenterFreqKey = (bandIndex: number) => `band${bandIndex}CenterFreq` as const
const getBandQKey = (bandIndex: number) => `band${bandIndex}Q` as const

export const AUDIO_GLOBAL_OPTION_NODE_CONFIGS = defineOptionNodeConfigs([
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
  {
    nodeType: 'param',
    key: 'fileAudioGainDb',
    title: 'File Audio Gain (dB, negative = auto)',
    valueType: 'number',
    defaultValue: 0,
    sliderMin: -24,
    sliderMax: 24,
  },
  // Generate hidden band configuration nodes from DEFAULT_BANDS
  ...DEFAULT_BANDS.flatMap((band, index) => [
    {
      nodeType: 'param' as const,
      key: getBandCenterFreqKey(index),
      title: `Band ${index} Center Frequency`,
      valueType: 'number' as const,
      defaultValue: band.centerFreq,
      hidden: true,
    },
    {
      nodeType: 'param' as const,
      key: getBandQKey(index),
      title: `Band ${index} Q Factor`,
      valueType: 'number' as const,
      defaultValue: band.q,
      hidden: true,
    },
  ]),
])

export const AUDIO_OPTION_NODE_CONFIGS = defineOptionNodeConfigs([
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
])

export type AudioGlobalOptionNodes = OptionNodesFromConfigs<typeof AUDIO_GLOBAL_OPTION_NODE_CONFIGS>

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

  /** The plugin's single, lazily-created AudioContext. */
  private context: AudioContext | null = null

  /** The single analyser every source (mic or timeline audio) is routed into. */
  private analyserNode: AnalyserNode | null = null

  /** The mic's source node, disconnected while timeline audio is routed in instead. */
  private micSource: MediaStreamAudioSourceNode | null = null

  private liveStreamSource: MediaStreamAudioSourceNode | null = null

  /** Applies file gain to timeline audio, which gets no microphone auto gain control. */
  private fileGainNode: GainNode | null = null

  /**
   * Peak-normalized gain per resource URL (auto mode only, `fileAudioGainDb < 0`).
   * Shared between live preview and render so both use the same value.
   */
  private peakGainCache = new Map<string, number>()

  /**
   * Reference to the engine's state store, set in `onEngineInitialize`
   */
  private _store?: EngineStore

  /**
   * Reference to the engine, set in `onEngineInitialize`
   */
  private engine?: HedronEngine

  constructor() {
    console.log('[AudioInput] Plugin initializing...')

    // Initialize audio device manager
    this.deviceManager = new AudioDeviceManager()
    AudioDeviceManager.ENABLE_LOGGING = AudioInput.ENABLE_LOGGING

    // Initialize audio analyzer
    this.analyzer = new AudioAnalyzer(DEFAULT_BANDS)
    // Initialize audio capture
    this.deviceManager
      .updateInputDeviceList()
      .then(() => {
        return this.initAudio()
      })
      .then(() => {
        console.log('[AudioInput] Audio system successfully initialized')
      })
      .catch((error) => {
        console.error('[AudioInput] Failed to initialize audio system:', error)
      })
  }

  /**
   * Called after engine initialization to create global option nodes and sync plugin state
   */
  public onEngineInitialize = (engine: HedronEngine): void => {
    this.engine = engine
    this._store = engine.getStore()

    engine.addNodeOnce(AUDIO_INPUT_NODE_ID, null, {
      title: 'Audio Input',
      key: 'audio-input',
      nodeType: 'custom',
      customNodeType: 'audio-input',
    })

    engine.addOptionNodes(AUDIO_INPUT_NODE_ID, AUDIO_GLOBAL_OPTION_NODE_CONFIGS)

    this.syncBandConfigurations()
  }

  public onNewInput = (engine: HedronEngine, newInput: InputNode): void => {
    engine.addOptionNodes(newInput.id, AUDIO_OPTION_NODE_CONFIGS)
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
    if (this.engine && this._store) {
      const centerFreqNodeId = this.engine.getNodeOptionNode(
        AUDIO_INPUT_NODE_ID,
        getBandCenterFreqKey(bandIndex),
      ).id
      const qNodeId = this.engine.getNodeOptionNode(AUDIO_INPUT_NODE_ID, getBandQKey(bandIndex)).id
      const storeState = this._store.getState()
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

      // The context and analyser are created once and reused across device changes.
      const context = this.getOrCreateContext()
      const analyser = this.getOrCreateAnalyser()

      // Log analyzer configuration
      if (AudioInput.ENABLE_LOGGING) {
        console.log('[AudioInput] Audio analyzer configuration:')
        console.log(`  - FFT Size: ${analyser.fftSize}`)
        console.log(`  - Frequency bin count: ${analyser.frequencyBinCount}`)
        console.log(`  - Min/Max decibels: ${analyser.minDecibels} to ${analyser.maxDecibels} dB`)
        console.log(`  - Smoothing time constant: ${analyser.smoothingTimeConstant}`)
      }

      // Replace any previous mic source (e.g. after a device change) with one for the new stream.
      this.micSource?.disconnect()
      this.micSource = context.createMediaStreamSource(stream)

      const audioData = this.audioData ?? this.analyzer.setupAudioData(analyser, context.sampleRate)

      // Mic only feeds the analyser when no element is routed in.
      if (!this.liveStreamSource) {
        this.micSource.connect(analyser)
      }

      return audioData
    } catch (error) {
      handleAudioError(error)
      throw error
    }
  }

  /** The plugin's single, long-lived AudioContext. */
  private getOrCreateContext(): AudioContext {
    if (!this.context) {
      this.context = new window.AudioContext()
      if (AudioInput.ENABLE_LOGGING) {
        console.log(
          `[AudioInput] Audio context created. Sample rate: ${this.context.sampleRate}Hz, State: ${this.context.state}`,
        )
      }
    }
    return this.context
  }

  /** The single analyser every source is routed into, kept at the spec-default dB window. */
  private getOrCreateAnalyser(): AnalyserNode {
    if (!this.analyserNode) {
      const analyser = this.getOrCreateContext().createAnalyser()
      // One shared dB window - mic and file input are measured identically.
      // File-specific correction happens as real gain instead (see fileGainNode).
      analyser.minDecibels = DEFAULT_MIN_DECIBELS
      analyser.maxDecibels = DEFAULT_MAX_DECIBELS
      // No native smoothing (browser default 0.8) - the `smoothing` param handles it, and the native one ramps in over the first offline-render frames.
      analyser.smoothingTimeConstant = 0
      this.analyserNode = analyser
    }
    return this.analyserNode
  }

  /**
   * Precomputes frequency data for `url` and switches the analyzer to sample it by frame
   * index (via `getTimeMs`) instead of reading live from the mic.
   */
  public async beginOfflineAnalysis({
    url,
    fps,
    frameCount,
    startSeconds = 0,
    getTimeMs,
  }: BeginOfflineAnalysisOptions): Promise<void> {
    await this.ensureAudioDataExists()

    const response = await fetch(url)
    const arrayBuffer = await response.arrayBuffer()

    // Decode at the live context's sample rate to match AudioAnalyzer's bin-to-frequency mapping.
    const analyser = this.audioData!.analyser
    const sampleRate = analyser.context.sampleRate
    const audioBuffer = await this.getOrCreateContext().decodeAudioData(arrayBuffer)

    const frames = await analyzeAudioOffline({
      audioBuffer,
      fps,
      frameCount,
      startSeconds,
      sampleRate,
      gain: this.resolveFileGain(url, audioBuffer),
      fftSize: analyser.fftSize,
      smoothingTimeConstant: analyser.smoothingTimeConstant,
      minDecibels: analyser.minDecibels,
      maxDecibels: analyser.maxDecibels,
    })

    const getFrameIndex = () => Math.round((getTimeMs() / 1000 - startSeconds) * fps)
    this.analyzer.beginOfflineAnalysis(frames, getFrameIndex)
  }

  /** Restores live (mic or timeline) analysis after a render finishes. */
  public endOfflineAnalysis(): void {
    this.analyzer.endOfflineAnalysis()
  }

  public setLiveStreamSource(audio: { stream: MediaStream; url: string } | null): void {
    const context = this.getOrCreateContext()
    const analyser = this.getOrCreateAnalyser()
    this.ensureAudioDataExists()

    this.liveStreamSource?.disconnect()
    this.liveStreamSource = null

    if (!audio) {
      this.fileGainNode?.disconnect()
      this.micSource?.connect(analyser)
      return
    }

    this.micSource?.disconnect()

    const source = context.createMediaStreamSource(audio.stream)
    const gainNode = this.fileGainNode ?? context.createGain()
    gainNode.disconnect()
    gainNode.connect(analyser)
    this.fileGainNode = gainNode

    source.connect(gainNode)
    this.liveStreamSource = source

    this.applyFileGain(audio.url, gainNode)
    this.ensureContextRunning()
  }

  /**
   * Applies manual dB gain, or (if `fileAudioGainDb` < 0) a cached/computed peak-normalized gain.
   * An uncached peak needs a decode - applies unity gain first, then resolves it async.
   */
  private applyFileGain(url: string, gainNode: GainNode): void {
    if (this.getFileAudioGainDb() >= 0) {
      gainNode.gain.value = this.getManualFileGain()
      return
    }

    const cached = this.peakGainCache.get(url)
    if (cached !== undefined) {
      gainNode.gain.value = cached
      return
    }

    gainNode.gain.value = 1
    this.getOrComputePeakGain(url)
      .then((gain) => {
        // Only apply if this node is still the live one - it may have changed mid-flight.
        if (this.fileGainNode === gainNode) {
          gainNode.gain.value = gain
        }
      })
      .catch((error) => {
        console.error('[AudioInput] Failed to compute peak-normalized gain:', error)
      })
  }

  /** Decodes `url` (uncached) purely to measure its peak - used when nothing has decoded it yet. */
  private async getOrComputePeakGain(url: string): Promise<number> {
    const cached = this.peakGainCache.get(url)
    if (cached !== undefined) return cached

    const response = await fetch(url)
    const arrayBuffer = await response.arrayBuffer()
    const audioBuffer = await this.getOrCreateContext().decodeAudioData(arrayBuffer)

    const gain = gainForPeak(computePeakAmplitude(audioBuffer), TARGET_PEAK_AMPLITUDE)
    this.peakGainCache.set(url, gain)
    return gain
  }

  /** Resolves gain for an already-decoded buffer (the render path always has one on hand). */
  private resolveFileGain(url: string, audioBuffer: AudioBuffer): number {
    if (this.getFileAudioGainDb() >= 0) return this.getManualFileGain()

    const cached = this.peakGainCache.get(url)
    if (cached !== undefined) return cached

    const gain = gainForPeak(computePeakAmplitude(audioBuffer), TARGET_PEAK_AMPLITUDE)
    this.peakGainCache.set(url, gain)
    return gain
  }

  /** Contexts start suspended until a user gesture; while suspended the analyser reads silence. */
  private ensureContextRunning(): void {
    if (this.context?.state === 'suspended') {
      this.context.resume().catch(() => {})
    }
  }

  /**
   * Ensures `this.audioData` exists, for render machines with no mic permission/init.
   * Sets up the shared analyser with nothing routed into it.
   */
  private ensureAudioDataExists(): void {
    if (this.audioData) return

    const context = this.getOrCreateContext()
    this.analyzer.setupAudioData(this.getOrCreateAnalyser(), context.sampleRate)
  }

  /** File audio gain in dB from the global options (default: 0). */
  private getFileAudioGainDb(): number {
    return this.engine?.getNodeOptionNodeValue<number>(AUDIO_INPUT_NODE_ID, 'fileAudioGainDb') ?? 0
  }

  /**
   * `fileAudioGainDb` as a linear gain multiplier (only valid when non-negative).
   * Flat boost across the signal, so frequency balance stays untouched.
   */
  private getManualFileGain(): number {
    return Math.pow(10, this.getFileAudioGainDb() / 20)
  }

  /**
   * Gets the master volume value from the global options
   * @returns Master volume value (default: 1.0)
   */
  private getMasterVolume(): number {
    return this.engine?.getNodeOptionNodeValue<number>(AUDIO_INPUT_NODE_ID, 'masterVolume') ?? 1.0
  }

  /**
   * Gets the smoothing value from the global options
   * @returns Smoothing value (default: 0)
   */
  private getSmoothing(): number {
    return this.engine?.getNodeOptionNodeValue<number>(AUDIO_INPUT_NODE_ID, 'smoothing') ?? 0
  }

  /**
   * Gets the normalize levels value from the global options
   * @returns Normalize levels value (default: 0)
   */
  private getNormalizeLevels(): number {
    return this.engine?.getNodeOptionNodeValue<number>(AUDIO_INPUT_NODE_ID, 'normalizeLevels') ?? 0
  }

  /**
   * Gets the levels falloff value from the global options
   * @returns Levels falloff value (default: 1)
   */
  private getLevelsFalloff(): number {
    return this.engine?.getNodeOptionNodeValue<number>(AUDIO_INPUT_NODE_ID, 'levelsFalloff') ?? 1
  }

  /**
   * Gets the levels power value from the global options
   * @returns Levels power value (default: 1)
   */
  private getLevelsPower(): number {
    return this.engine?.getNodeOptionNodeValue<number>(AUDIO_INPUT_NODE_ID, 'levelsPower') ?? 1
  }

  /**
   * Gets the max level falloff multiplier value from the global options
   * @returns Max level falloff multiplier value (default: 0.9999)
   */
  private getMaxLevelFalloffMultiplier(): number {
    return (
      this.engine?.getNodeOptionNodeValue<number>(
        AUDIO_INPUT_NODE_ID,
        'maxLevelFalloffMultiplier',
      ) ?? 0.9999
    )
  }

  /**
   * Gets the max level minimum value from the global options
   * @returns Max level minimum value (default: 0.001)
   */
  private getMaxLevelMinimum(): number {
    return (
      this.engine?.getNodeOptionNodeValue<number>(AUDIO_INPUT_NODE_ID, 'maxLevelMinimum') ?? 0.001
    )
  }

  /**
   * Gets band configuration values from the store
   * @param bandIndex Index of the band (0-3)
   * @returns Object with centerFreq and q values
   */
  private getBandConfig(bandIndex: number): { centerFreq: number; q: number } {
    const defaults = DEFAULT_BANDS[bandIndex] || { centerFreq: 1000, q: 1 }
    const getValue = (key: string) =>
      this.engine?.getNodeOptionNodeValue<number>(AUDIO_INPUT_NODE_ID, key)
    return {
      centerFreq: getValue(getBandCenterFreqKey(bandIndex)) ?? defaults.centerFreq,
      q: getValue(getBandQKey(bandIndex)) ?? defaults.q,
    }
  }

  /**
   * Syncs band configurations from store to analyzer
   */
  private syncBandConfigurations(): void {
    for (let i = 0; i < DEFAULT_BANDS.length; i++) {
      const config = this.getBandConfig(i)
      this.analyzer.updateBand(i, config.centerFreq, config.q)
      if (AudioInput.ENABLE_LOGGING) {
        console.log(`[AudioInput] Synced band ${i}: ${config.centerFreq}Hz, Q=${config.q}`)
      }
    }
  }

  /**
   * Updates audio analysis on each engine frame (called via HedronEngine.advanceFrame).
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

    // Keep manual gain in sync each frame so the slider takes effect immediately.
    // Auto/peak gain is resolved once at routing time (applyFileGain) and left alone here.
    if (this.liveStreamSource) {
      if (this.fileGainNode && this.getFileAudioGainDb() >= 0) {
        this.fileGainNode.gain.value = this.getManualFileGain()
      }
      // Retry resume in case the context was created before the first user gesture.
      this.ensureContextRunning()
    }

    // Update the analyzer
    this.analyzer.update()

    // Update nodes based on new audio levels
    this.updateInputNodes()
  }

  /**
   * Updates sketch nodes based on current audio levels
   * Called each frame from the main update loop
   */
  private updateInputNodes() {
    if (!this._store) return

    const storeState = this._store.getState()
    handleEachInput<typeof AUDIO_OPTION_NODE_CONFIGS>(
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
