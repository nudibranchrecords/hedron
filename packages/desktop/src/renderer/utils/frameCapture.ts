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
  const base64Array: string[] = []

  // Helper to wait for next animation frame
  const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))

  for (let i = 0; i < frameCount; i++) {
    // Advance engine state
    if (engine.stepFrame) {
      engine.stepFrame()
    } else if (engine.render) {
      engine.render()
    }

    // Wait for the next animation frame to ensure rendering is complete
    await nextFrame()

    // Capture the frame after rendering
    const dataUrl = engine.captureFrame()
    if (!dataUrl) {
      console.error(`Failed to capture frame at index ${i}`)
      return
    }
    base64Array.push(dataUrl.replace(/^data:image\/png;base64,/, ''))
    // Optionally, show progress
    if (i % 10 === 0) {
      console.log(`Captured frame ${i + 1} / ${frameCount}`)
    }
  }
  const result = (await window.electronApi.ipcRenderer.invoke(
    FrameEvents.SaveFrameSequence,
    base64Array,
    name,
    video,
  )) as SaveFrameSequenceResponse

  if (result.success) {
    console.log(`Frame sequence saved to: ${result.path}`)
    if (video && result.videoPath) {
      console.log(`Video created at: ${result.videoPath}`)
    }
  } else {
    console.error(`Failed to save frame sequence: ${result.error}`)
  }
}

// Add a log to indicate the function is available
console.log(
  '💡 Use window.saveFrame() to save the current frame as a PNG file to your Documents folder',
)
console.log(
  '💡 Use window.renderFrames(frameCount, name, video?) to save a sequence of frames to Documents/<name>/<name>-<frameIndex>.png and optionally create an mp4',
)
