import { useState } from 'react'
import { Button } from '@hedron-gl/ui-core'
import c from './VideoControls.module.css'

// Include the global type definitions
declare global {
  interface Window {
    renderFrames: (
      frameCount: number,
      name: string,
      video?: boolean,
      width?: number,
      height?: number,
      audioPath?: string,
    ) => Promise<void>
  }
}

export interface RenderSettings {
  frameCount: number
  name: string
  createVideo: boolean
  width: number | null
  height: number | null
  audioPath: string
}

interface RenderTabProps {
  renderSettings: RenderSettings
  setRenderSettings: React.Dispatch<React.SetStateAction<RenderSettings>>
}

export function RenderTab({ renderSettings, setRenderSettings }: RenderTabProps): JSX.Element {
  const [isRendering, setIsRendering] = useState(false)
  const [progress, setProgress] = useState(0)
  const [renderingStatus, setRenderingStatus] = useState('Preparing...')

  // Function to render frames/video
  const handleRender = async () => {
    setIsRendering(true)
    setProgress(0)
    setRenderingStatus('Preparing to render...')

    try {
      // Setup progress tracking
      const totalFrames = renderSettings.frameCount
      let processedFrames = 0

      // Override console.log to track progress
      const originalConsoleLog = console.log
      console.log = (message: string) => {
        originalConsoleLog(message)
        if (typeof message === 'string') {
          if (message.includes('Saved frame')) {
            const match = message.match(/Saved frame (\d+) \/ (\d+)/)
            if (match && match[1] && match[2]) {
              processedFrames = parseInt(match[1])
              setProgress(Math.floor((processedFrames / totalFrames) * 100))
              setRenderingStatus(`Rendering frames: ${processedFrames}/${totalFrames}`)
            }
          } else if (message.includes('Creating video')) {
            setRenderingStatus('Creating video file...')
          } else if (message.includes('Video created at')) {
            setRenderingStatus('Video created successfully!')
          }
        }
      }

      // Call the window.renderFrames function
      await window.renderFrames(
        renderSettings.frameCount,
        renderSettings.name,
        renderSettings.createVideo,
        renderSettings.width || undefined,
        renderSettings.height || undefined,
        renderSettings.audioPath || undefined,
      )

      // Restore console.log
      console.log = originalConsoleLog

      // Ensure progress is 100% when complete
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
  }
  // Handle input changes for render settings
  const handleRenderSettingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setRenderSettings((prev) => ({ ...prev, [name]: checked }))
    } else if (name === 'width' || name === 'height') {
      const numValue = value === '' ? null : Number(value)
      setRenderSettings((prev) => ({ ...prev, [name]: numValue }))
    } else {
      setRenderSettings((prev) => ({ ...prev, [name]: value }))
    }
  }

  return (
    <div className={c.form}>
      <div className={c.formGroupRow} style={{ alignItems: 'flex-start' }}>
        <div style={{ flex: 2 }}>
          Output Name
          <input
            className={c.input}
            type="text"
            id="name"
            name="name"
            value={renderSettings.name}
            onChange={handleRenderSettingChange}
            disabled={isRendering}
          />
        </div>
        <div style={{ flex: 1 }}>
          Frame Count (at 30fps)
          <input
            className={c.input}
            type="number"
            id="frameCount"
            name="frameCount"
            value={renderSettings.frameCount}
            onChange={handleRenderSettingChange}
            min="1"
            disabled={isRendering}
          />
          {Math.round((renderSettings.frameCount / 30) * 10) / 10} seconds at 30fps
        </div>
      </div>

      <div className={c.formGroupRow}>
        <input
          className={c.checkbox}
          type="checkbox"
          id="createVideo"
          name="createVideo"
          checked={renderSettings.createVideo}
          onChange={handleRenderSettingChange}
          disabled={isRendering}
        />
        Create Video (requires ffmpeg)
      </div>

      <div className={c.formGroup}>
        Audio File Path (optional, relative to Documents)
        <input
          className={c.input}
          type="text"
          id="audioPath"
          name="audioPath"
          value={renderSettings.audioPath}
          onChange={handleRenderSettingChange}
          disabled={isRendering || !renderSettings.createVideo}
          placeholder="example.wav"
        />
      </div>

      <div className={c.formGroup}>
        Resolution (optional)
        <div className={c.formGroupRow}>
          <input
            className={c.input}
            type="number"
            placeholder="Width"
            name="width"
            value={renderSettings.width || ''}
            onChange={handleRenderSettingChange}
            disabled={isRendering}
            style={{ width: '50%' }}
          />
          <span>×</span>
          <input
            className={c.input}
            type="number"
            placeholder="Height"
            name="height"
            value={renderSettings.height || ''}
            onChange={handleRenderSettingChange}
            disabled={isRendering}
            style={{ width: '50%' }}
          />
        </div>
        <small>Leave empty to use current canvas size</small>
      </div>

      {isRendering && (
        <div className={c.progressContainer}>
          <div>{renderingStatus}</div>
          <div className={c.progressBar}>
            <div className={c.progressFill} style={{ width: `${progress}%` }} />
          </div>
          <div className={c.status}>{progress}% complete</div>
        </div>
      )}

      <div>
        <Button type="secondary" onClick={handleRender} disabled={isRendering}>
          {isRendering ? 'Rendering...' : 'Render'}
        </Button>
      </div>
    </div>
  )
}
