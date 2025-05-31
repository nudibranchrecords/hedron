// This file adds a simple utility to the window object for saving frames as PNG files

import { engine } from '@renderer/engine'
import { FrameEvents, SaveFrameResponse, SaveFrameSequenceResponse } from '@shared/FrameEvents'

// Define the type for the window object extension
declare global {
  interface Window {
    saveFrame: () => Promise<void>
    renderFrames: (frameCount: number, name: string, video?: boolean) => Promise<void>
  }
}

// Implement the save frame function
window.saveFrame = async () => {
  const dataUrl = engine.captureFrame()

  if (!dataUrl) {
    console.error('Failed to capture frame: No canvas data available')
    return
  }

  // Remove data URL header
  const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '')

  // Use Electron's IPC to save the file in the main process
  const result = (await window.electronApi.ipcRenderer.invoke(
    FrameEvents.SaveFrame,
    base64Data,
  )) as SaveFrameResponse

  if (result.success) {
    console.log(`Frame saved successfully to: ${result.path}`)
  } else {
    console.error(`Failed to save frame: ${result.error}`)
  }
}

// Implement the render frames function
window.renderFrames = async (frameCount: number, name: string, video: boolean = false) => {
  const fps = 30
  const filePaths: string[] = []

  if (typeof engine.renderFramesSequence === 'function') {
    await engine.renderFramesSequence(
      frameCount,
      fps,
      async (dataUrl: string, frameIndex: number) => {
        const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '')
        // Save each frame immediately
        const result = await window.electronApi.ipcRenderer.invoke(
          FrameEvents.SaveFrame,
          base64Data,
          name,
          frameIndex,
        )
        if (result.success && result.path) {
          filePaths.push(result.path)
        } else {
          console.error(`Failed to save frame ${frameIndex}: ${result.error}`)
        }
        if ((frameIndex + 1) % 10 === 0 || frameIndex === frameCount - 1) {
          console.log(`Saved frame ${frameIndex + 1} / ${frameCount}`)
        }
      },
    )
  } else {
    console.error('engine.renderFramesSequence is not available')
    return
  }

  console.log(`Frame sequence saved to Documents/${name}/`)

  // After all frames, optionally create video
  let videoPath: string | undefined = undefined
  if (video) {
    const result = await window.electronApi.ipcRenderer.invoke(
      FrameEvents.SaveFrameSequence,
      [], // No base64 array needed, just trigger video creation
      name,
      true,
    )
    if (result.success && result.videoPath) {
      videoPath = result.videoPath
      console.log(`Video created at: ${videoPath}`)
    } else {
      console.error(`Failed to create video: ${result.error}`)
    }
  }
}

// Add a log to indicate the function is available
console.log(
  '💡 Use window.saveFrame() to save the current frame as a PNG file to your Documents folder',
)
console.log(
  '💡 Use window.renderFrames(frameCount, name, video?) to save a sequence of frames to Documents/<name>/<name>-<frameIndex>.png and optionally create an mp4',
)
