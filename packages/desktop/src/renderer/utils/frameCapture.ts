// This file adds a simple utility to the window object for saving frames as PNG files

import { engine } from '@renderer/engine'
import { FrameEvents, SaveFrameResponse } from '@shared/FrameEvents'

// Define the type for the window object extension
declare global {
  interface Window {
    saveFrame: () => Promise<void>
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

// Add a log to indicate the function is available
console.log(
  '💡 Use window.saveFrame() to save the current frame as a PNG file to your Documents folder',
)
