import { AudioBufferSink, Input, UrlSource, ALL_FORMATS } from 'mediabunny'
import type { WrappedAudioBuffer } from 'mediabunny'

export type TimelineAudioState = 'idle' | 'loading' | 'buffering' | 'playing' | 'paused' | 'error'

export type TimelineAudioLoadingMode = 'preload' | 'stream'

export type TimelineAudioSource = { stream: MediaStream; url: string }

export type OnAudioSourceChangeCallback = (source: TimelineAudioSource | null) => void

type AudioTrack = { id: string; audioUrl: string }

type StreamingTrack = {
  input: Input | null
  iterator: AsyncGenerator<WrappedAudioBuffer, void, unknown> | null
  buffers: WrappedAudioBuffer[]
  origin: number
  decodedUntil: number
  pending: boolean
  ended: boolean
}

type TimelineAudioPlayerOptions = {
  audioLoadingMode: TimelineAudioLoadingMode
  onPositionChange: (positionMs: number) => void
  onStateChange: (state: TimelineAudioState) => void
  onError: () => void
}

export class TimelineAudioPlayer {
  private tracks: AudioTrack[] = []
  private bufferCache = new Map<string, AudioBuffer>()
  private loadController: AbortController | null = null
  private outputNode: GainNode | null = null
  private analysisDestination: MediaStreamAudioDestinationNode | null = null
  private audioSourceChangeCallback: OnAudioSourceChangeCallback | null = null
  private silent = false
  private audioContext: AudioContext | null = null
  private streamingTracks: StreamingTrack[] = []
  private loadSessionId = 0
  private streamingTimer: ReturnType<typeof setInterval> | null = null
  private streamingSources = new Set<AudioBufferSourceNode>()
  private boundarySource: ConstantSourceNode | null = null
  private audioAnchor: { contextTime: number; position: number } | null = null
  private scheduledUntil = 0
  private positionMs = 0
  private durationMs = 0
  private playing = false
  private audioState: TimelineAudioState = 'idle'
  private audioError: string | null = null
  private underruns = 0
  private disposed = false

  constructor(private options: TimelineAudioPlayerOptions) {}

  private shouldPlayAudio() {
    return !this.silent && this.tracks.length > 0
  }

  setTracks(tracks: AudioTrack[], durationMs: number) {
    if (this.disposed) return
    if (this.shouldPlayAudio()) this.samplePosition()
    this.durationMs = durationMs
    const nextTracks = tracks.filter((track) => track.audioUrl)
    const urlsChanged =
      this.tracks.length !== nextTracks.length ||
      this.tracks.some((track, index) => track.audioUrl !== nextTracks[index].audioUrl)
    this.tracks = nextTracks

    const activeUrls = new Set(nextTracks.map((track) => track.audioUrl))
    for (const url of this.bufferCache.keys()) {
      if (!activeUrls.has(url)) this.bufferCache.delete(url)
    }
    if (urlsChanged) {
      this.stopStreaming()
      this.reportAudioSource()
      if (this.tracks.length > 0) this.prepareAudio()
      else this.setState(this.playing ? 'playing' : 'idle')
    }
  }

  onAudioSourceChange(callback: OnAudioSourceChangeCallback) {
    this.audioSourceChangeCallback = callback
    this.reportAudioSource()
  }

  private reportAudioSource() {
    this.audioSourceChangeCallback?.(
      this.analysisDestination && this.tracks.length > 0
        ? { stream: this.analysisDestination.stream, url: this.tracks[0].audioUrl }
        : null,
    )
  }

  play(positionMs: number, durationMs: number, options?: { silent?: boolean }) {
    if (this.playing || this.disposed) return
    if (positionMs !== this.positionMs) this.seek(positionMs, durationMs)
    this.durationMs = durationMs
    this.silent = options?.silent ?? false
    this.playing = true
    if (this.shouldPlayAudio()) {
      if (this.audioState === 'error') this.prepareAudio()
      const sessionId = this.loadSessionId
      try {
        void this.audioContext
          ?.resume()
          .then(() => {
            if (sessionId === this.loadSessionId) this.scheduleStreaming(sessionId)
          })
          .catch((error: unknown) => this.failStreaming(error, sessionId))
        this.startScheduler()
        this.scheduleStreaming(sessionId)
      } catch (error) {
        this.failStreaming(error, sessionId)
      }
      return
    }
    this.setState('playing')
  }

  pause() {
    if (this.shouldPlayAudio()) this.samplePosition()
    this.stopSources()
    this.playing = false
    if (this.audioState !== 'error') this.setState('paused')
  }

  seek(positionMs: number, durationMs: number) {
    const positionChanged = positionMs !== this.positionMs
    this.stopSources()
    this.positionMs = positionMs
    this.durationMs = durationMs
    this.scheduledUntil = positionMs / 1000
    if (positionChanged && this.options.audioLoadingMode === 'stream') {
      this.stopStreaming()
      if (this.tracks.length > 0) this.prepareAudio()
    }
    if (this.playing && this.shouldPlayAudio()) {
      this.startScheduler()
      this.scheduleStreaming(this.loadSessionId)
    }
  }

  private setState(state: TimelineAudioState) {
    this.audioState = state
    this.options.onStateChange(state)
  }

  private samplePosition() {
    if (!this.audioAnchor || !this.audioContext) return
    const elapsed = Math.max(0, this.audioContext.currentTime - this.audioAnchor.contextTime)
    this.positionMs = Math.min(
      this.durationMs,
      this.scheduledUntil * 1000,
      (this.audioAnchor.position + elapsed) * 1000,
    )
    this.options.onPositionChange(this.positionMs)
  }

  private stopSources() {
    if (this.streamingTimer !== null) clearInterval(this.streamingTimer)
    this.streamingTimer = null
    this.audioAnchor = null
    if (this.boundarySource) {
      this.boundarySource.onended = null
      this.boundarySource.stop()
      this.boundarySource.disconnect()
      this.boundarySource = null
    }
    for (const source of this.streamingSources) {
      source.onended = null
      source.stop()
      source.disconnect()
    }
    this.streamingSources.clear()
    this.scheduledUntil = this.positionMs / 1000
  }

  private stopStreaming() {
    this.loadSessionId++
    this.loadController?.abort()
    this.loadController = null
    this.stopSources()
    for (const track of this.streamingTracks) {
      track.input?.dispose()
      void track.iterator?.return().catch(() => {})
    }
    this.streamingTracks = []
    this.scheduledUntil = this.positionMs / 1000
  }

  private failStreaming(error: unknown, sessionId: number) {
    if (sessionId !== this.loadSessionId || this.disposed) return
    this.samplePosition()
    this.stopStreaming()
    this.playing = false
    this.audioError = error instanceof Error ? error.message : String(error)
    this.setState('error')
    this.options.onError()
  }

  private prepareAudio() {
    if (this.disposed) return
    this.stopStreaming()
    if (!this.playing || !this.silent) this.setState('loading')
    this.audioError = null
    const sessionId = this.loadSessionId
    try {
      this.audioContext ??= new AudioContext({ latencyHint: 'interactive' })
      if (!this.outputNode) {
        this.outputNode = this.audioContext.createGain()
        this.outputNode.connect(this.audioContext.destination)
        this.analysisDestination = this.audioContext.createMediaStreamDestination()
        this.outputNode.connect(this.analysisDestination)
        this.reportAudioSource()
      }
      if (this.options.audioLoadingMode === 'preload') {
        void this.initializeBufferedTracks(sessionId)
        if (this.playing && this.shouldPlayAudio()) this.startScheduler()
        return
      }
      const position = this.positionMs / 1000
      this.streamingTracks = this.tracks.map(({ audioUrl }) => ({
        input: new Input({
          formats: ALL_FORMATS,
          source: new UrlSource(audioUrl, {
            maxCacheSize: 4 * 1024 * 1024,
            getRetryDelay: (attempt) => (attempt < 3 ? 2 ** attempt : null),
          }),
        }),
        iterator: null,
        buffers: [],
        origin: 0,
        decodedUntil: position,
        pending: true,
        ended: false,
      }))
      for (const record of this.streamingTracks) {
        void this.initializeStreamingTrack(record, position, sessionId)
      }
      if (this.playing && this.shouldPlayAudio()) this.startScheduler()
    } catch (error) {
      this.failStreaming(error, sessionId)
    }
  }

  private startScheduler() {
    if (this.streamingTimer !== null) return
    const sessionId = this.loadSessionId
    this.streamingTimer = setInterval(() => this.scheduleStreaming(sessionId), 25)
  }

  private async initializeBufferedTracks(sessionId: number) {
    const controller = new AbortController()
    this.loadController = controller
    const context = this.audioContext!
    try {
      const loads = new Map<string, Promise<AudioBuffer>>()
      const buffers = await Promise.all(
        this.tracks.map(({ audioUrl }) => {
          const cached = this.bufferCache.get(audioUrl)
          if (cached) return Promise.resolve(cached)
          let loading = loads.get(audioUrl)
          if (!loading) {
            loading = (async () => {
              const response = await fetch(audioUrl, { signal: controller.signal })
              if (!response.ok) throw new Error(`Failed to load audio: HTTP ${response.status}`)
              const data = await response.arrayBuffer()
              if (controller.signal.aborted) throw new Error('Audio load cancelled')
              const buffer = await context.decodeAudioData(data)
              if (sessionId === this.loadSessionId) this.bufferCache.set(audioUrl, buffer)
              return buffer
            })()
            loads.set(audioUrl, loading)
          }
          return loading
        }),
      )
      if (sessionId !== this.loadSessionId || this.disposed) return
      this.streamingTracks = buffers.map((buffer) => ({
        input: null,
        iterator: null,
        buffers: [{ buffer, timestamp: 0, duration: buffer.duration }],
        origin: 0,
        decodedUntil: buffer.duration,
        pending: false,
        ended: true,
      }))
      if (!this.playing && this.audioState === 'loading') this.setState('idle')
      this.scheduleStreaming(sessionId)
    } catch (error) {
      this.failStreaming(error, sessionId)
    }
  }

  private async initializeStreamingTrack(
    record: StreamingTrack,
    position: number,
    sessionId: number,
  ) {
    try {
      const track = await record.input!.getPrimaryAudioTrack()
      if (sessionId !== this.loadSessionId) return
      if (!track || !(await track.canDecode()))
        throw new Error('Audio codec is not supported by this browser.')
      const origin = await track.getFirstTimestamp()
      if (sessionId !== this.loadSessionId) return
      record.origin = origin
      record.iterator = new AudioBufferSink(track).buffers(position + origin)
      record.pending = false
      this.fillStreamingTrack(record, sessionId)
    } catch (error) {
      this.failStreaming(error, sessionId)
    }
  }

  private fillStreamingTrack(record: StreamingTrack, sessionId: number) {
    if (record.pending || record.ended || !record.iterator) return
    if (record.decodedUntil >= this.positionMs / 1000 + 2) return
    record.pending = true
    void record.iterator
      .next()
      .then((result) => {
        if (sessionId !== this.loadSessionId) return
        record.pending = false
        if (result.done) {
          record.ended = true
        } else {
          const buffer = { ...result.value, timestamp: result.value.timestamp - record.origin }
          const end = buffer.timestamp + buffer.buffer.duration
          if (end > record.decodedUntil) {
            if (buffer.timestamp > record.decodedUntil + 0.001) {
              throw new Error(
                'Audio contains a timestamp gap; this prototype requires contiguous audio.',
              )
            }
            record.buffers.push(buffer)
            record.decodedUntil = end
          }
        }
        if (!this.playing && this.audioState === 'loading') this.setState('idle')
        this.fillStreamingTrack(record, sessionId)
        this.scheduleStreaming(sessionId)
      })
      .catch((error: unknown) => this.failStreaming(error, sessionId))
  }

  step(deltaMs: number, positionMs: number, durationMs: number) {
    if (!this.playing) return
    if (this.shouldPlayAudio()) {
      this.scheduleStreaming(this.loadSessionId)
    } else {
      this.positionMs = Math.max(0, Math.min(positionMs + deltaMs, durationMs))
      this.options.onPositionChange(this.positionMs)
    }
  }

  private scheduleStreaming(sessionId: number) {
    if (
      sessionId !== this.loadSessionId ||
      !this.playing ||
      !this.shouldPlayAudio() ||
      !this.audioContext
    )
      return
    if (this.streamingTracks.length !== this.tracks.length) return
    const context = this.audioContext
    this.samplePosition()
    const position = this.positionMs / 1000
    if (position >= this.durationMs / 1000) return

    if (
      this.audioAnchor &&
      context.currentTime >=
        this.audioAnchor.contextTime + this.scheduledUntil - this.audioAnchor.position
    ) {
      this.audioAnchor = null
      this.setState('buffering')
      this.underruns++
    }

    for (const record of this.streamingTracks) {
      record.buffers = record.buffers.filter(
        (buffer) => buffer.timestamp + buffer.buffer.duration > position,
      )
      this.fillStreamingTrack(record, sessionId)
    }
    if (this.streamingTracks.some((track) => !track.iterator && !track.ended)) return
    const readyUntil = Math.min(
      this.durationMs / 1000,
      position + 2,
      ...this.streamingTracks.map((track) => (track.ended ? Infinity : track.decodedUntil)),
    )
    if (context.state !== 'running') {
      this.setState('buffering')
      return
    }
    if (!this.audioAnchor) {
      if (readyUntil - position < Math.min(0.25, this.durationMs / 1000 - position) - 0.000001)
        return
      this.audioAnchor = { contextTime: context.currentTime + 0.05, position }
      this.scheduledUntil = position
    }
    if (readyUntil <= this.scheduledUntil + 0.000001) return

    const anchor = this.audioAnchor
    for (const record of this.streamingTracks) {
      for (const { buffer, timestamp } of record.buffers) {
        const start = Math.max(this.scheduledUntil, timestamp)
        const end = Math.min(readyUntil, timestamp + buffer.duration)
        if (end <= start) continue
        const source = context.createBufferSource()
        source.buffer = buffer
        source.connect(this.outputNode!)
        source.onended = () => {
          source.disconnect()
          this.streamingSources.delete(source)
        }
        this.streamingSources.add(source)
        source.start(anchor.contextTime + start - anchor.position, start - timestamp, end - start)
      }
    }
    this.scheduledUntil = readyUntil
    if (this.boundarySource) {
      this.boundarySource.onended = null
      this.boundarySource.stop()
      this.boundarySource.disconnect()
    }
    const boundary = context.createConstantSource()
    boundary.offset.value = 0
    boundary.connect(context.destination)
    boundary.onended = () => {
      boundary.disconnect()
      this.scheduleStreaming(sessionId)
    }
    boundary.start()
    boundary.stop(anchor.contextTime + readyUntil - anchor.position)
    this.boundarySource = boundary
    this.setState('playing')
  }

  getDiagnostics(positionMs: number) {
    const position = positionMs / 1000
    const bufferedUntil =
      this.streamingTracks.length === 0
        ? position
        : Math.min(
            this.durationMs / 1000,
            ...this.streamingTracks.map((track) =>
              track.ended ? this.durationMs / 1000 : track.decodedUntil,
            ),
          )
    return {
      state: this.audioState,
      playRequested: this.playing,
      contextState: this.audioContext?.state ?? null,
      bufferedAheadMs: Math.max(0, (bufferedUntil - position) * 1000),
      scheduledAheadMs: Math.max(0, this.scheduledUntil * 1000 - positionMs),
      underruns: this.underruns,
      error: this.audioError,
    }
  }

  dispose() {
    if (this.disposed) return
    this.pause()
    this.stopStreaming()
    this.disposed = true
    this.bufferCache.clear()
    this.audioSourceChangeCallback?.(null)
    this.audioSourceChangeCallback = null
    this.outputNode?.disconnect()
    this.analysisDestination?.disconnect()
    this.analysisDestination?.stream.getTracks().forEach((track) => track.stop())
    if (this.audioContext) {
      void this.audioContext.close().catch(() => {})
      this.audioContext = null
    }
  }
}
