import { useEffect } from 'react'
import { useEngine, useNodeOptionNodes } from '@hedron-gl/ui-core'
import { VIDEO_RENDER_NODE_ID } from '@/constants'
import { VideoRenderOptionNodes, VideoRenderPlugin } from '@/VideoRenderPlugin'

// Registers the behavior behind the "captureFrame" shot node (the trigger pad rendered in this
// panel) so MIDI/LFO/Timeline inputs can fire it, same as any other shot.
export const useCaptureFrameShot = () => {
  const engine = useEngine()
  const optionNodes = useNodeOptionNodes<VideoRenderOptionNodes>(VIDEO_RENDER_NODE_ID)
  const captureFrameNode = optionNodes['captureFrame']

  useEffect(() => {
    if (!captureFrameNode) return

    const videoRenderPlugin = engine.getPlugin<VideoRenderPlugin>('video-render')
    engine.registerShot(captureFrameNode.id, () => videoRenderPlugin?.captureFrame())
  }, [engine, captureFrameNode])
}
