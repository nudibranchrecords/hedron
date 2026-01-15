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
      prewarmFrames?: number,
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
  frameIndex?: number | string,
  frameCount?: number,
): Promise<SaveFrameResponse> {
  const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '')

  // Apply padding if we have frameCount
  let paddedFrameIndex = frameIndex
  if (frameCount !== undefined && typeof frameIndex === 'number') {
    const padding = String(frameCount - 1).length
    paddedFrameIndex = String(frameIndex).padStart(padding, '0')
  }

  const result = (await window.electronApi.ipcRenderer.invoke(
    FrameEvents.SaveFrame,
    base64Data,
    name,
    paddedFrameIndex,
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
  prewarmFrames: number = 0,
) => {
  const fps = 30
  const filePaths: string[] = []

  // Ensure prewarmFrames is a number to prevent string concatenation
  const prewarm = Number(prewarmFrames) || 0
  const frames = Number(frameCount)

  // Store original size if resizing
  let originalSize: { width: number; height: number } | null = null
  if (width && height) {
    originalSize = engine.getRendererSize()
    engine.resizeRenderer(width, height)
  }

  if (prewarm > 0) {
    console.log(`Prewarming ${prewarm} frames...`)
  }

  engine.resetTime() // Reset the engine time before starting
  engine.jumpTime(-prewarm / fps) // Jump to time 0 to start from the beginning

  if (typeof engine.renderFramesSequence === 'function') {
    // Render total frames including prewarm, but only save frames after prewarm
    console.log(`Starting renderFramesSequence with ${frames + prewarm} total frames`)
    try {
      await engine.renderFramesSequence(
        frames + prewarm,
        fps,
        async (dataUrl: string, frameIndex: number | string) => {
          const frameNum = Number(frameIndex)

          // Skip saving prewarm frames
          if (frameNum < prewarm) {
            if (frameNum === prewarm - 1) {
              console.log('Prewarm complete, starting render...')
            }
            return
          }

          // Adjust frame index to start from 0 after prewarm
          const adjustedFrameIndex = frameNum - prewarm

          // Stop saving after we've saved all the frames we need
          if (adjustedFrameIndex >= frames) {
            return
          }

          try {
            const result = await saveFrameViaIPC(dataUrl, name, adjustedFrameIndex, frames)
            if (result.success && result.path) {
              filePaths.push(result.path)
            } else {
              console.error(`Failed to save frame ${adjustedFrameIndex}: ${result.error}`)
            }

            if ((adjustedFrameIndex + 1) % 10 === 0 || adjustedFrameIndex === frames - 1) {
              console.log(`Saved frame ${adjustedFrameIndex + 1} / ${frames}`)
            }
          } catch (error) {
            console.error(`Error saving frame ${adjustedFrameIndex}:`, error)
          }
        },
        width,
        height,
      )
      console.log('renderFramesSequence completed')
    } catch (error) {
      console.error('Error in renderFramesSequence:', error)
      throw error
    }

    console.log('All frames rendered')
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
    console.log('Creating video...')
    const result = await window.electronApi.ipcRenderer.invoke(
      FrameEvents.SaveFrameSequence,
      [], // No base64 array needed, just trigger video creation
      name,
      true,
      audioPath, // Pass the audio path to the IPC call
      frames, // Pass the frame count for padding calculation
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

  console.log('Render complete')
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
