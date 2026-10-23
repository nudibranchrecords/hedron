import { useSyncExternalStore } from 'react'
import {
  ControlGrid,
  NodeContainer,
  useEngine,
  useNodeOptionNodes,
  useParamValue,
} from '@hedron-gl/ui-core'
import { DEFAULT_TIMELINE_ID, TimelineOptionNodes } from '@hedron-gl/timeline'
import c from './VideoRenderGlobalPanel.module.css'
import { VIDEO_RENDER_NODE_ID } from '@/constants'
import { VideoRenderOptionNodes, VideoRenderPlugin } from '@/VideoRenderPlugin'

export function VideoRenderGlobalPanel(): JSX.Element {
  const engine = useEngine()
  const videoRenderPlugin = engine.getPlugin<VideoRenderPlugin>('video-render')
  if (!videoRenderPlugin) {
    throw new Error('Video Render plugin is not registered')
  }
  const { isRendering, progress, status, error } = useSyncExternalStore(
    videoRenderPlugin.subscribeToRenderState,
    videoRenderPlugin.getRenderState,
    videoRenderPlugin.getRenderState,
  )

  // Knows about the timeline plugin (reads its duration/audio); the timeline package has no
  // knowledge of this plugin.
  const timelineOptionNodes = useNodeOptionNodes<TimelineOptionNodes>(DEFAULT_TIMELINE_ID)
  const durationSeconds = useParamValue<number>(timelineOptionNodes['timelineDurationS']!.id, 0)
  const audioFileName = useParamValue<string | null>(timelineOptionNodes['audioUrl']!.id)

  const optionNodes = useNodeOptionNodes<VideoRenderOptionNodes>(VIDEO_RENDER_NODE_ID)
  const captureFrameNode = optionNodes['captureFrame']
  const renderShotNode = optionNodes['render']
  const outputDirNode = optionNodes['outputDirAbsolute']!
  const nameNode = optionNodes['name']!
  const createVideoNode = optionNodes['createVideo']!
  const widthNode = optionNodes['width']!
  const heightNode = optionNodes['height']!
  const fpsNode = optionNodes['fps']!
  const prewarmSecondsNode = optionNodes['prewarmSeconds']!
  const startSecondsNode = optionNodes['startSeconds']!
  const endSecondsNode = optionNodes['endSeconds']!

  const fps = useParamValue<number>(fpsNode.id, 30)
  const startSeconds = useParamValue<number>(startSecondsNode.id, 0)
  const endSeconds = useParamValue<number>(endSecondsNode.id, durationSeconds)

  const validRange =
    Number.isFinite(startSeconds) &&
    Number.isFinite(endSeconds) &&
    startSeconds >= 0 &&
    endSeconds > startSeconds &&
    endSeconds <= durationSeconds
  const frameCount = validRange
    ? Math.max(1, Math.round((endSeconds - startSeconds) * (fps || 30)))
    : 0

  return (
    <div className={c.form}>
      <NodeContainer nodeId={outputDirNode.id} />

      <ControlGrid>
        <NodeContainer nodeId={nameNode.id} />
        <NodeContainer nodeId={createVideoNode.id} />
      </ControlGrid>

      <ControlGrid>
        <NodeContainer nodeId={startSecondsNode.id} />
        <NodeContainer nodeId={endSecondsNode.id} />
      </ControlGrid>

      <ControlGrid>
        <NodeContainer nodeId={widthNode.id} />
        <NodeContainer nodeId={heightNode.id} />
        <NodeContainer nodeId={fpsNode.id} />
        <NodeContainer nodeId={prewarmSecondsNode.id} />
      </ControlGrid>

      <small>
        Width/height of 0 uses the current canvas size. Create Video requires ffmpeg. Timeline is{' '}
        {(durationSeconds || 0).toFixed(1)}s, exporting {startSeconds}s to {endSeconds}s (
        {frameCount} frames at {fps || 30}fps).
        {audioFileName ? ` Audio: ${audioFileName}.` : ' No audio resource set on the timeline.'}
      </small>

      {!validRange && (
        <div role="alert">Choose a range within the timeline with end after start.</div>
      )}

      {isRendering && (
        <div className={c.progressContainer}>
          <div>{status}</div>
          <div className={c.progressBar}>
            <div className={c.progressFill} style={{ width: `${progress}%` }} />
          </div>
          <div className={c.status}>{progress}% complete</div>
        </div>
      )}

      {error && <div role="alert">{error}</div>}

      <ControlGrid>
        {renderShotNode && <NodeContainer nodeId={renderShotNode.id} />}
        {captureFrameNode && <NodeContainer nodeId={captureFrameNode.id} />}
      </ControlGrid>
    </div>
  )
}
