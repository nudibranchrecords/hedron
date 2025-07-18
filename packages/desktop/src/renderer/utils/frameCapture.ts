// This file adds a simple utility to the window object for saving frames as PNG files

import { engine } from '@renderer/engine'
import { FrameEvents, SaveFrameResponse } from '@shared/FrameEvents'

// Define the type for the window object extension
declare global {
  interface Window {
    saveFrame: () => Promise<void>
    renderFrames: (
      frameCount: number,
      name: string,
      video?: boolean,
      width?: number,
      height?: number,
      audioPath?: string,
    ) => Promise<void>
    resetEvery: (seconds: number, offset?: number) => void
    cancelReset: () => void
    resetTimeoutId?: NodeJS.Timeout | null
  }
}
// Helper to save a frame (base64 or dataUrl) via IPC
async function saveFrameViaIPC(
  dataUrl: string,
  name?: string,
  frameIndex?: number,
): Promise<SaveFrameResponse> {
  const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '')
  const result = (await window.electronApi.ipcRenderer.invoke(
    FrameEvents.SaveFrame,
    base64Data,
    name,
    frameIndex,
  )) as SaveFrameResponse
  return result
}

// Implement the save frame function
window.saveFrame = async () => {
  const dataUrl = engine.captureFrame()

  if (!dataUrl) {
    console.error('Failed to capture frame: No canvas data available')
    return
  }

  const result = await saveFrameViaIPC(dataUrl)

  if (result.success) {
    console.log(`Frame saved successfully to: ${result.path}`)
  } else {
    console.error(`Failed to save frame: ${result.error}`)
  }
}

// Implement the render frames function
window.renderFrames = async (
  frameCount: number,
  name: string,
  video: boolean = false,
  width?: number,
  height?: number,
  audioPath?: string,
) => {
  const fps = 30
  const filePaths: string[] = []
  engine.resetTime() // Reset the engine time before starting

  // Store original size if resizing
  let originalSize: { width: number; height: number } | null = null
  if (width && height) {
    originalSize = engine.getRendererSize()
    engine.resizeRenderer(width, height)
  }

  if (typeof engine.renderFramesSequence === 'function') {
    await engine.renderFramesSequence(
      frameCount,
      fps,
      async (dataUrl: string, frameIndex: number) => {
        const result = await saveFrameViaIPC(dataUrl, name, frameIndex)
        if (result.success && result.path) {
          filePaths.push(result.path)
        } else {
          console.error(`Failed to save frame ${frameIndex}: ${result.error}`)
        }
        if ((frameIndex + 1) % 10 === 0 || frameIndex === frameCount - 1) {
          console.log(`Saved frame ${frameIndex + 1} / ${frameCount}`)
        }
      },
      width,
      height,
    )
  } else {
    console.error('engine.renderFramesSequence is not available')
    // Restore original size if needed
    if (originalSize) {
      engine.resizeRenderer(originalSize.width, originalSize.height)
    }
    return
  }

  // Restore original size after rendering
  if (originalSize) {
    engine.resizeRenderer(originalSize.width, originalSize.height)
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
      audioPath, // Pass the audio path to the IPC call
    )
    if (result.success && result.videoPath) {
      videoPath = result.videoPath
      console.log(`Video created at: ${videoPath}`)
      if (audioPath) {
        console.log(`Video includes audio from: ${audioPath}`)
      }
    } else {
      console.error(`Failed to create video: ${result.error}`)
    }
  }
}

// Using window.resetTimeoutId so it can be accessed by other components
window.resetTimeoutId = null
/**
 * 'Reset' the sketch time every x seconds by applying an offset to the deltaTime pased into sketches.
 * This is useful for testing looping animations.
 * There is an optional parameter to set an offset, which is useful for testing just the loop point of a long animation.
 * This function does not actually reset the time, it just applies an offset to the deltaTime passed into sketches.
 * @param seconds The number of seconds to reset the time every
 * @param offset An optional offset to apply to the deltaTime passed into sketches. This is useful for testing just the loop point of a long animation.
 * @example
 * window.resetEvery(10) // Resets the time every 10 seconds
 * window.resetEvery(10, 9) // Resets the time every 10 seconds, but starts at 9 seconds, plays to 10 seconds, then plays from 0 to 1 seconds, before jumping back to 9 and starting again.
 */
window.resetEvery = (seconds: number, offset?: number) => {
  if (window.resetTimeoutId) {
    clearTimeout(window.resetTimeoutId)
  }
  engine.resetTime() // Ensure the engine time is reset before starting
  let animTime = seconds
  if (offset) {
    engine.jumpTime(offset)
    animTime -= offset
  }
  let side: boolean = true // Used to alternate the jump time
  const jump = () => {
    engine.resetTime() // Reset the engine time
    if (offset && side) {
      engine.jumpTime(offset) // Jump to the offset time
    }
    side = !side // Alternate the side for the next jump
    window.resetTimeoutId = setTimeout(jump, animTime * 1000)
  }
  window.resetTimeoutId = setTimeout(jump, animTime * 1000)
}

/**
 * Cancel the resetEvery function, stopping the time resets.
 */
window.cancelReset = () => {
  if (window.resetTimeoutId) {
    engine.resetTime() // Reset the engine time when cancelling
    clearTimeout(window.resetTimeoutId)
    window.resetTimeoutId = null
    console.log('Time reset cancelled')
  }
}

// Add a log to indicate the function is available
console.info(
  '[HEDRON] 💡 Use window.saveFrame() to save the current frame as a PNG file to your Documents folder',
)
console.log(
  '[HEDRON] 💡 Use window.renderFrames(frameCount, name, video?, width?, height?, audioPath?) to save a sequence of frames to Documents/<name>/<name>-<frameIndex>.png and optionally create an mp4 with audio',
)
