/**
 * Precomputes per-frame frequency spectrum data via a real `AnalyserNode` in an
 * `OfflineAudioContext`, so a deterministic render can sample by frame index instead of live input.
 */

/** Render quantum size used by the Web Audio spec; suspend() times must land on a multiple of this. */
const RENDER_QUANTUM_FRAMES = 128

export interface OfflineAnalysisOptions {
  audioBuffer: AudioBuffer
  /** Frames per second of the render this analysis is being computed for. */
  fps: number
  /** Total number of frames to precompute (should match the render's frame count). */
  frameCount: number
  /** Must match the live AudioContext's rate - AudioAnalyzer derives its bin-to-frequency mapping from it. */
  sampleRate: number
  /** Linear gain applied before analysis, mirroring the live element path's gain node. */
  gain: number
  /** Mirrored from the live `AnalyserNode` so offline output matches on-screen behavior. */
  fftSize: number
  smoothingTimeConstant: number
  minDecibels: number
  maxDecibels: number
}

export interface OfflineAnalysisResult {
  binCount: number
  frameCount: number
  /** Flat, row-major table: `frameCount * binCount` bytes. */
  data: Uint8Array
  /** Returns a view into `data` for the given frame index (clamped to a valid row). */
  getFrame(frameIndex: number): Uint8Array
}

const quantizeToRenderQuantum = (timeSeconds: number, sampleRate: number): number => {
  const quantumDuration = RENDER_QUANTUM_FRAMES / sampleRate
  return Math.round(timeSeconds / quantumDuration) * quantumDuration
}

/** Samples one `getByteFrequencyData` row per frame, in order (the analyser's smoothing is stateful). */
export const analyzeAudioOffline = async ({
  audioBuffer,
  fps,
  frameCount,
  sampleRate,
  gain,
  fftSize,
  smoothingTimeConstant,
  minDecibels,
  maxDecibels,
}: OfflineAnalysisOptions): Promise<OfflineAnalysisResult> => {
  const renderLength = Math.max(1, Math.ceil(audioBuffer.duration * sampleRate))

  // Two channels, matching the live path's downmix - keeps render identical to preview.
  const offlineContext = new OfflineAudioContext(2, renderLength, sampleRate)

  const source = offlineContext.createBufferSource()
  source.buffer = audioBuffer

  const gainNode = offlineContext.createGain()
  gainNode.gain.value = gain

  const analyser = offlineContext.createAnalyser()
  analyser.fftSize = fftSize
  analyser.smoothingTimeConstant = smoothingTimeConstant
  analyser.minDecibels = minDecibels
  analyser.maxDecibels = maxDecibels

  source.connect(gainNode)
  gainNode.connect(analyser)
  // Must stay connected into the graph for the context to process it, even though nothing here is audible.
  analyser.connect(offlineContext.destination)
  source.start(0)

  const binCount = analyser.frequencyBinCount
  const data = new Uint8Array(frameCount * binCount)
  const row = new Uint8Array(binCount)
  const quantumDuration = RENDER_QUANTUM_FRAMES / sampleRate

  // Suspend times, one per frame: quantum-aligned, strictly increasing, at least one quantum in
  // (nothing to read at t=0). `null` marks frames past the end of the audio (always a suffix).
  const suspendTimes: (number | null)[] = []
  let lastTime = 0
  for (let frame = 0; frame < frameCount; frame++) {
    let time = Math.max(quantumDuration, quantizeToRenderQuantum(frame / fps, sampleRate))
    if (time <= lastTime) {
      time = lastTime + quantumDuration
    }

    if (time >= audioBuffer.duration) {
      suspendTimes.push(null)
      continue
    }

    suspendTimes.push(time)
    lastTime = time
  }

  // Each suspend must be scheduled before the preceding resume, or rendering overruns the
  // sample point and the suspend promise rejects.
  const firstTime = suspendTimes[0]
  let pendingSuspend = firstTime === null ? null : offlineContext.suspend(firstTime)
  const renderingDone = offlineContext.startRendering()

  for (let frame = 0; frame < frameCount; frame++) {
    if (pendingSuspend) {
      await pendingSuspend

      analyser.getByteFrequencyData(row as Uint8Array<ArrayBuffer>)

      const nextTime = suspendTimes[frame + 1] ?? null
      pendingSuspend = nextTime === null ? null : offlineContext.suspend(nextTime)

      offlineContext.resume()
    }

    // Past the end of the audio: hold the last computed row for any remaining frames.
    data.set(row, frame * binCount)
  }

  await renderingDone

  // Worth flagging: indistinguishable from a correctly-analysed silent track otherwise.
  if (!data.some((value) => value !== 0)) {
    console.warn(
      '[OfflineSpectrumAnalyzer] Analysis produced no signal; the render will have no audio reaction.',
    )
  }

  return {
    binCount,
    frameCount,
    data,
    getFrame(frameIndex: number): Uint8Array {
      const clamped = Math.min(frameCount - 1, Math.max(0, frameIndex))
      return data.subarray(clamped * binCount, (clamped + 1) * binCount)
    },
  }
}
