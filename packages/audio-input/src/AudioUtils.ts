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

/**
 * Linear interpolation between two values
 * @param v0 Starting value
 * @param v1 End value
 * @param t Interpolation factor (0-1)
 * @returns Interpolated value
 */
export function lerp(v0: number, v1: number, t: number) {
  return (1 - t) * v0 + t * v1
}

/**
 * Standard bell curve (Gaussian) function for band-pass filtering
 * @param x Input value (frequency)
 * @param center Center frequency
 * @param q Q factor (higher values = narrower band)
 * @returns Weight between 0 and 1
 */
export function bellCurve(x: number, center: number, q: number): number {
  // Convert Q to standard deviation (sigma)
  // In a bell curve, higher Q = narrower curve = smaller sigma
  const sigma = center / (q * 10)
  const exponent = -Math.pow(x - center, 2) / (2 * sigma * sigma)
  return Math.exp(exponent)
}
