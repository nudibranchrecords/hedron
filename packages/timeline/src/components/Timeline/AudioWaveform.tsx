import { useEffect, useRef, useSyncExternalStore } from 'react'
import c from './Timeline.module.css'

export interface TimelineAudioBufferSource {
  getAudioBuffer: (url: string) => AudioBuffer | undefined
  subscribeAudioBuffers: (listener: () => void) => () => void
}

const peakCache = new WeakMap<AudioBuffer, { minimum: Float32Array; maximum: Float32Array }>()
const subscribeNothing = () => () => {}

const getPeaks = (buffer: AudioBuffer) => {
  const cached = peakCache.get(buffer)
  if (cached) return cached
  const count = Math.min(buffer.length, 16384)
  const minimum = new Float32Array(count)
  const maximum = new Float32Array(count)
  minimum.fill(Infinity)
  maximum.fill(-Infinity)
  for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
    const samples = buffer.getChannelData(channel)
    for (let index = 0; index < samples.length; index++) {
      const bucket = Math.floor((index * count) / buffer.length)
      minimum[bucket] = Math.min(minimum[bucket], samples[index])
      maximum[bucket] = Math.max(maximum[bucket], samples[index])
    }
  }
  const peaks = { minimum, maximum }
  peakCache.set(buffer, peaks)
  return peaks
}

export const AudioWaveform = ({
  source,
  audioUrl,
  durationMs,
}: {
  source?: TimelineAudioBufferSource
  audioUrl: string
  durationMs: number
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const buffer = useSyncExternalStore(
    source?.subscribeAudioBuffers ?? subscribeNothing,
    () => source?.getAudioBuffer(audioUrl),
    () => undefined,
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const draw = () => {
      const ratio = window.devicePixelRatio || 1
      canvas.width = Math.min(8192, Math.max(1, Math.round(canvas.clientWidth * ratio)))
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * ratio))
      const context = canvas.getContext('2d')
      if (!context || !buffer || durationMs <= 0 || buffer.length === 0) return
      const peaks = getPeaks(buffer)
      const bucketsPerPixel =
        ((durationMs / 1000 / buffer.duration) * peaks.minimum.length) / canvas.width
      const amplitude = Math.max(0, canvas.height / 2 - 2 * ratio)
      context.fillStyle = getComputedStyle(canvas).color
      for (let column = 0; column < canvas.width; column++) {
        const start = Math.floor(column * bucketsPerPixel)
        if (start >= peaks.minimum.length) break
        const end = Math.min(
          peaks.minimum.length,
          Math.max(start + 1, Math.ceil((column + 1) * bucketsPerPixel)),
        )
        let minimum = 1
        let maximum = -1
        for (let bucket = start; bucket < end; bucket++) {
          minimum = Math.min(minimum, peaks.minimum[bucket])
          maximum = Math.max(maximum, peaks.maximum[bucket])
        }
        const top = canvas.height / 2 - Math.min(1, maximum) * amplitude
        const bottom = canvas.height / 2 - Math.max(-1, minimum) * amplitude
        context.fillRect(column, top, 1, Math.max(1, bottom - top))
      }
    }
    const observer = new ResizeObserver(draw)
    observer.observe(canvas)
    draw()
    return () => observer.disconnect()
  }, [buffer, durationMs])

  return (
    <canvas ref={canvasRef} className={c.audioWaveform} role="img" aria-label="Audio waveform" />
  )
}
