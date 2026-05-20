import { Button } from '@hedron-gl/ui-core'
import type { ReactElement } from 'react'

// Include the global type definitions
declare global {
  interface Window {
    saveFrame: () => Promise<void>
  }
}

export function CaptureTab(): ReactElement {
  // Function to capture a single frame
  const handleCapture = () => {
    window.saveFrame()
  }
  return (
    <div>
      <p>
        Capture the current canvas frame as a PNG file. The file will be saved to your Documents
        folder with a timestamped filename.
      </p>
      <div>
        <Button type="secondary" onClick={handleCapture}>
          Capture Frame
        </Button>
      </div>
    </div>
  )
}
