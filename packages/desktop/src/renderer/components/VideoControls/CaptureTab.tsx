import c from './VideoControls.module.css'

// Include the global type definitions
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

interface CaptureTabProps {
  // No props needed
}

export function CaptureTab(): JSX.Element {
  // Function to capture a single frame
  const handleCapture = () => {
    window.saveFrame()
  }
  return (
    <div className={c.form}>
      <p>
        Capture the current canvas frame as a PNG file. The file will be saved to your Documents
        folder with a timestamped filename.
      </p>
      <div className={c.buttonRow}>
        <button className={`${c.actionButton} ${c.primaryButton}`} onClick={handleCapture}>
          Capture Frame
        </button>
      </div>
    </div>
  )
}
