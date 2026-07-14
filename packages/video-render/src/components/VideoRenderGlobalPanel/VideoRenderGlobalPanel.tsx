import { useCallback, useEffect, useState } from 'react'
import {
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

export function VideoRenderGlobalPanel(): JSX.Element {
  useCaptureFrameShot()

  const engine = useEngine()
  const videoRenderPlugin = engine.getPlugin<VideoRenderPlugin>('video-render')

  // Knows about the timeline plugin (reads its duration/audio); the timeline package has no
  // knowledge of this plugin.
  const timelineOptionNodes = useNodeOptionNodes<TimelineOptionNodes>(DEFAULT_TIMELINE_ID)
  const durationSeconds = useParamValue<number>(timelineOptionNodes['durationSeconds']!.id)
  const audioFileName = useParamValue<string | null>(timelineOptionNodes['audioUrl']!.id)

  const optionNodes = useNodeOptionNodes<VideoRenderOptionNodes>(VIDEO_RENDER_NODE_ID)
  const captureFrameNode = optionNodes['captureFrame']
  const browseOutputDirNode = optionNodes['browseOutputDir']
  const renderShotNode = optionNodes['render']
  const outputDirNode = optionNodes['outputDirAbsolute']!
  const nameNode = optionNodes['name']!
  const createVideoNode = optionNodes['createVideo']!
  const widthNode = optionNodes['width']!
  const heightNode = optionNodes['height']!
  const fpsNode = optionNodes['fps']!

  const outputDirAbsolute = useParamValue<string>(outputDirNode.id)
  const name = useParamValue<string>(nameNode.id)
  const createVideo = useParamValue<boolean>(createVideoNode.id)
  const width = useParamValue<number>(widthNode.id)
  const height = useParamValue<number>(heightNode.id)
  const fps = useParamValue<number>(fpsNode.id)

  const [isRendering, setIsRendering] = useState(false)
  const [progress, setProgress] = useState(0)
  const [renderingStatus, setRenderingStatus] = useState('Preparing...')

  const frameCount = Math.max(1, Math.round(durationSeconds * (fps || 30)))

  const handleBrowseOutputDir = useCallback(async () => {
    const dir = await videoRenderPlugin?.selectOutputDir()
    if (dir) {
      engine.setParamValue(outputDirNode.id, dir)
    }
  }, [videoRenderPlugin, engine, outputDirNode.id])

  const handleRender = useCallback(async () => {
    if (!outputDirAbsolute || isRendering) return

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
        name,
        fps,
        outputDirAbsolute,
        video: createVideo,
        width,
        height,
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
  }, [
    outputDirAbsolute,
    isRendering,
    frameCount,
    name,
    fps,
    createVideo,
    width,
    height,
    audioFileName,
    videoRenderPlugin,
  ])

  useEffect(() => {
    if (!browseOutputDirNode) return
    engine.registerShot(browseOutputDirNode.id, () => handleBrowseOutputDir())
  }, [engine, browseOutputDirNode, handleBrowseOutputDir])

  useEffect(() => {
    if (!renderShotNode) return
    engine.registerShot(renderShotNode.id, () => handleRender())
  }, [engine, renderShotNode, handleRender])

  return (
    <div className={c.form}>
      <div className={c.outputDirRow}>
        <div className={c.outputDirInput}>
          <NodeContainer nodeId={outputDirNode.id} />
        </div>
        {browseOutputDirNode && (
          <div className={c.outputDirBrowse}>
            <NodeContainer nodeId={browseOutputDirNode.id} />
          </div>
        )}
      </div>

      <ControlGrid>
        <NodeContainer nodeId={nameNode.id} />
        <NodeContainer nodeId={createVideoNode.id} />
      </ControlGrid>

      <ControlGrid>
        <NodeContainer nodeId={widthNode.id} />
        <NodeContainer nodeId={heightNode.id} />
        <NodeContainer nodeId={fpsNode.id} />
      </ControlGrid>

      <small>
        Width/height of 0 uses the current canvas size. Create Video requires ffmpeg. Timeline is{' '}
        {(durationSeconds || 0).toFixed(1)}s, rendering {frameCount} frames at {fps || 30}fps.
        {audioFileName ? ` Audio: ${audioFileName}.` : ' No audio resource set on the timeline.'}
      </small>

      {isRendering && (
        <div className={c.progressContainer}>
          <div>{renderingStatus}</div>
          <div className={c.progressBar}>
            <div className={c.progressFill} style={{ width: `${progress}%` }} />
          </div>
          <div className={c.status}>{progress}% complete</div>
        </div>
      )}

      <ControlGrid>
        {renderShotNode && <NodeContainer nodeId={renderShotNode.id} />}
        {captureFrameNode && <NodeContainer nodeId={captureFrameNode.id} />}
      </ControlGrid>
    </div>
  )
}
