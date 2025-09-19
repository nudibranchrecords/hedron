/**
 * AudioUtils.ts
 * Shared utilities for audio operations used across components
 */

/**
 * Creates a new AudioContext with cross-browser compatibility
 * @returns A new AudioContext instance
 */
export function createAudioContext(): AudioContext {
  return new (window.AudioContext || (window as any).webkitAudioContext)()
}

/**
 * Interface for test tone options
 */
export interface TestToneOptions {
  /** Frequency in Hz */
  frequency: number
  /** Volume (0-1) */
  volume: number
  /** Wave type */
  type?: OscillatorType
}

/**
 * Creates and configures an oscillator for test tones
 * @param audioContext The AudioContext to use
 * @param options Configuration options for the tone
 * @returns Object containing the oscillator and gain nodes
 */
export function createOscillator(
  audioContext: AudioContext,
  options: TestToneOptions,
): {
  oscillator: OscillatorNode
  gainNode: GainNode
} {
  // Create oscillator
  const oscillator = audioContext.createOscillator()
  oscillator.type = options.type || 'sine'
  oscillator.frequency.value = options.frequency

  // Create gain node for volume control
  const gainNode = audioContext.createGain()
  gainNode.gain.value = options.volume

  // Connect nodes
  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)

  return { oscillator, gainNode }
}

/**
 * Plays a test tone with the specified parameters
 * @param options Configuration options or frequency (for backward compatibility)
 * @param duration Duration in milliseconds (0 for continuous)
 * @param volume Volume level from 0-1 (only used if first param is a number)
 * @returns Object with audio nodes and a stop function, or a Promise if duration is provided
 */
export function playTestTone(
  options: TestToneOptions | number,
  duration?: number,
  volume?: number,
):
  | Promise<void>
  | {
      audioContext: AudioContext
      oscillator: OscillatorNode
      gainNode: GainNode
      stop: () => void
    } {
  // Process parameters for backward compatibility
  const toneOptions: TestToneOptions =
    typeof options === 'number'
      ? { frequency: options, volume: volume || 0.5, type: 'sine' }
      : options

  const toneDuration = typeof options === 'number' ? duration || 1000 : duration || 0

  // Create audio context and oscillator
  const audioContext = createAudioContext()
  const { oscillator, gainNode } = createOscillator(audioContext, toneOptions)

  // Log info about the tone
  console.log(
    `[AudioTest] Playing ${toneOptions.frequency}Hz test tone${toneDuration > 0 ? ` for ${toneDuration}ms` : ''} at volume ${toneOptions.volume}`,
  )

  // Create the control object with stop function
  const toneControl = {
    audioContext,
    oscillator,
    gainNode,
    stop: () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId)
      }
      try {
        oscillator.stop()
        audioContext.close()
        console.log('[AudioTest] Test tone stopped')
      } catch (err) {
        // Ignore errors that might occur if already stopped
      }
    },
  }

  // Start oscillator
  oscillator.start()

  // Setup automatic stop if duration is provided
  let timeoutId: number | undefined
  if (toneDuration > 0) {
    // If duration is specified, return a Promise
    return new Promise<void>((resolve, reject) => {
      try {
        timeoutId = window.setTimeout(() => {
          toneControl.stop()
          resolve()
        }, toneDuration)
      } catch (error) {
        console.error('[AudioTest] Error in test tone:', error)
        reject(error)
      }
    })
  }

  // Otherwise return the control object
  return toneControl
}

/**
 * Calculates the average level from an array of audio level values
 * @param levels Array of audio level values (0-1)
 * @returns Average level (0-1)
 */
export function calculateAverageLevel(levels: number[]): number {
  if (!levels || levels.length === 0) return 0
  return levels.reduce((sum, val) => sum + (val || 0), 0) / levels.length
}

/**
 * Maps a level value to a color based on intensity
 * @param level Audio level value (0-1)
 * @returns CSS color string
 */
export function getLevelColor(level: number): string {
  return level > 0.8 ? '#FF5252' : level > 0.5 ? '#FFEB3B' : '#4CAF50'
}

/**
 * Clamps a value between min and max
 * @param value Value to clamp
 * @param min Minimum value
 * @param max Maximum value
 * @returns Clamped value
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

/**
 * Converts from logarithmic frequency to linear position
 * @param freq Frequency in Hz
 * @param width Width of the display area
 * @param minFreq Minimum frequency
 * @param maxFreq Maximum frequency
 * @returns X position (0 to width)
 */
export function freqToX(freq: number, width: number, minFreq: number, maxFreq: number): number {
  const logMin = Math.log10(minFreq)
  const logMax = Math.log10(maxFreq)
  const logFreq = Math.log10(freq)
  return (width * (logFreq - logMin)) / (logMax - logMin)
}

/**
 * Converts from linear position to logarithmic frequency
 * @param x X position (0 to width)
 * @param width Width of the display area
 * @param minFreq Minimum frequency
 * @param maxFreq Maximum frequency
 * @returns Frequency in Hz
 */
export function xToFreq(x: number, width: number, minFreq: number, maxFreq: number): number {
  const logMin = Math.log10(minFreq)
  const logMax = Math.log10(maxFreq)
  const logFreq = logMin + (x / width) * (logMax - logMin)
  return Math.pow(10, logFreq)
}

/**
 * Converts from Q factor to Y position
 * @param q Q factor value
 * @param height Height of the display area
 * @returns Y position (0 to height)
 */
export function qToY(q: number, height: number): number {
  // Q range: 0.1 to 10
  // Lower Q (wider band) = higher y position
  const normalizedQ = 1 - (Math.log10(q) + 1) / 2
  return height * normalizedQ
}

/**
 * Converts from Y position to Q factor
 * @param y Y position (0 to height)
 * @param height Height of the display area
 * @returns Q factor value
 */
export function yToQ(y: number, height: number): number {
  const normalizedQ = 1 - y / height
  return Math.pow(10, normalizedQ * 2 - 1)
}
