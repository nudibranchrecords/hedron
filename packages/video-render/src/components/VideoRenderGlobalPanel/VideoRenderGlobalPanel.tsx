import { useState, useEffect } from 'react'
import {
  Button,
  ControlGrid,
  NodeContainer,
  useEngine,
  useNodeOptionNodes,
  useParamValue,
} from '@hedron-gl/ui-core'
import { DEFAULT_TIMELINE_ID, TimelineOptionNodes } from '@hedron-gl/timeline'
import { useCaptureFrameShot } from './useCaptureFrameShot'
import c from './VideoRenderGlobalPanel.module.css'
import { VIDEO_RENDER_NODE_ID } from '@/constants'
import { VideoRenderOptionNodes, VideoRenderPlugin } from '@/VideoRenderPlugin'
import { RenderFramesOptions, RenderProgress } from '@/types'

interface RenderSettings {
  name: string
  createVideo: boolean
  width: number | null
  height: number | null
  fps: number
  outputDirAbsolute: string
}

const defaultRenderSettings: RenderSettings = {
  name: 'hedron-render',
  createVideo: true,
  width: null,
  height: null,
  fps: 30,
  outputDirAbsolute: '',
}

export function VideoRenderGlobalPanel(): JSX.Element {
  useCaptureFrameShot()

  const engine = useEngine()
  const videoRenderPlugin = engine.getPlugin<VideoRenderPlugin>('video-render')

  // Knows about the timeline plugin (reads its duration/audio); the timeline package has no
  // knowledge of this plugin.
  const timelineOptionNodes = useNodeOptionNodes<TimelineOptionNodes>(DEFAULT_TIMELINE_ID)
  const durationSeconds = useParamValue<number>(timelineOptionNodes['durationSeconds']!.id)
  const audioFileName = useParamValue<string | null>(timelineOptionNodes['audioUrl']!.id)

  const videoRenderOptionNodes = useNodeOptionNodes<VideoRenderOptionNodes>(VIDEO_RENDER_NODE_ID)
  const captureFrameNode = videoRenderOptionNodes['captureFrame']

  const [renderSettings, setRenderSettings] = useState<RenderSettings>(defaultRenderSettings)
  const [isRendering, setIsRendering] = useState(false)
  const [progress, setProgress] = useState(0)
  const [renderingStatus, setRenderingStatus] = useState('Preparing...')

  useEffect(() => {
    const saved = sessionStorage.getItem('hedron-render-settings')
    if (saved) {
      setRenderSettings((prev) => ({ ...prev, ...JSON.parse(saved) }))
    }
  }, [])

  useEffect(() => {
    sessionStorage.setItem('hedron-render-settings', JSON.stringify(renderSettings))
  }, [renderSettings])

  const frameCount = Math.max(1, Math.round(durationSeconds * renderSettings.fps))

  const handleBrowseOutputDir = async () => {
    const outputDirAbsolute = await videoRenderPlugin?.selectOutputDir()
    if (outputDirAbsolute) {
      setRenderSettings((prev) => ({ ...prev, outputDirAbsolute }))
    }
  }

  const handleRender = async () => {
    if (!renderSettings.outputDirAbsolute) return

    setIsRendering(true)
    setProgress(0)
    setRenderingStatus('Preparing to render...')

    try {
      const handleProgress = (progress: RenderProgress) => {
        if (progress.stage === 'rendering-frames') {
          setProgress(Math.floor((progress.framesSaved / progress.totalFrames) * 100))
          setRenderingStatus(`Rendering frames: ${progress.framesSaved}/${progress.totalFrames}`)
        } else if (progress.stage === 'building-video') {
          setRenderingStatus('Creating video file...')
        }
      }

      const options: RenderFramesOptions = {
        frameCount,
        name: renderSettings.name,
        fps: renderSettings.fps,
        outputDirAbsolute: renderSettings.outputDirAbsolute,
        video: renderSettings.createVideo,
        width: renderSettings.width ?? undefined,
        height: renderSettings.height ?? undefined,
        audioFileName: audioFileName ?? undefined,
      }
      await videoRenderPlugin?.renderFrames(options, handleProgress)

      setProgress(100)
      setRenderingStatus('Render completed!')
      setTimeout(() => {
        setIsRendering(false)
        setProgress(0)
      }, 2000)
    } catch (error) {
      console.error('Error during rendering:', error)
      setIsRendering(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      setRenderSettings((prev) => ({ ...prev, [name]: e.target.checked }))
    } else if (name === 'width' || name === 'height' || name === 'fps') {
      setRenderSettings((prev) => ({ ...prev, [name]: value === '' ? null : Number(value) }))
    } else {
      setRenderSettings((prev) => ({ ...prev, [name]: value }))
    }
  }

  return (
    <div className={c.form}>
      <div className={c.formGroup}>
        Output Directory
        <div className={c.formGroupRow}>
          <input
            className={c.input}
            type="text"
            value={renderSettings.outputDirAbsolute}
            readOnly
            placeholder="Choose a folder..."
            disabled={isRendering}
          />
          <Button
            size="short"
            type="neutral"
            onClick={handleBrowseOutputDir}
            disabled={isRendering}
          >
            Browse
          </Button>
        </div>
      </div>

      <div className={c.formGroupRow} style={{ alignItems: 'flex-start' }}>
        <div style={{ flex: 2 }}>
          Output Name
          <input
            className={c.input}
            type="text"
            name="name"
            value={renderSettings.name}
            onChange={handleChange}
            disabled={isRendering}
          />
        </div>
        <div style={{ flex: 1 }}>
          FPS
          <input
            className={c.input}
            type="number"
            name="fps"
            value={renderSettings.fps}
            onChange={handleChange}
            min="1"
            disabled={isRendering}
          />
        </div>
      </div>

      <small>
        Timeline is {(durationSeconds || 0).toFixed(1)}s, rendering {frameCount} frames at{' '}
        {renderSettings.fps}fps.
        {audioFileName ? ` Audio: ${audioFileName}.` : ' No audio resource set on the timeline.'}
      </small>

      <div className={c.formGroupRow}>
        <input
          className={c.checkbox}
          type="checkbox"
          name="createVideo"
          checked={renderSettings.createVideo}
          onChange={handleChange}
          disabled={isRendering}
        />
        Create Video (requires ffmpeg)
      </div>

      <div className={c.formGroup}>
        Resolution (optional)
        <div className={c.formGroupRow}>
          <input
            className={c.input}
            type="number"
            placeholder="Width"
            name="width"
            value={renderSettings.width ?? ''}
            onChange={handleChange}
            disabled={isRendering}
            style={{ width: '50%' }}
          />
          <span>×</span>
          <input
            className={c.input}
            type="number"
            placeholder="Height"
            name="height"
            value={renderSettings.height ?? ''}
            onChange={handleChange}
            disabled={isRendering}
            style={{ width: '50%' }}
          />
        </div>
        <small>Leave empty to use current canvas size</small>
      </div>

      {isRendering && (
        <div className={c.progressContainer}>
          <div>{renderingStatus}</div>
          <div className={c.progressBar}>
            <div className={c.progressFill} style={{ width: `${progress}%` }} />
          </div>
          <div className={c.status}>{progress}% complete</div>
        </div>
      )}

      <div>
        <Button
          type="secondary"
          onClick={handleRender}
          disabled={isRendering || !renderSettings.outputDirAbsolute}
        >
          {isRendering ? 'Rendering...' : 'Render'}
        </Button>
      </div>

      {captureFrameNode && (
        <ControlGrid>
          <NodeContainer nodeId={captureFrameNode.id} />
        </ControlGrid>
      )}
    </div>
  )
}
