import { useState, useEffect } from 'react'
import c from './VideoControls.module.css'
import { CaptureTab } from './CaptureTab'
import { LoopTab, type LoopSettings } from './LoopTab'
import { RenderTab, type RenderSettings } from './RenderTab'

interface VideoControlsProps {
  className?: string
}

// Initialize with default settings
const defaultRenderSettings: RenderSettings = {
  frameCount: 300, // 10 seconds at 30fps
  name: 'hedron-render',
  createVideo: true,
  width: null,
  height: null,
  audioPath: '',
}

const defaultLoopSettings: LoopSettings = {
  seconds: 10,
  offset: null,
}

// Tabs
type TabType = 'render' | 'capture' | 'loop'

export function VideoControls({ className }: VideoControlsProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>('render')
  const [renderSettings, setRenderSettings] = useState<RenderSettings>(defaultRenderSettings)
  const [loopSettings, setLoopSettings] = useState<LoopSettings>(defaultLoopSettings)

  // Load settings from sessionStorage on first render
  useEffect(() => {
    const savedRenderSettings = sessionStorage.getItem('hedron-render-settings')
    if (savedRenderSettings) {
      setRenderSettings(JSON.parse(savedRenderSettings))
    }

    const savedLoopSettings = sessionStorage.getItem('hedron-loop-settings')
    if (savedLoopSettings) {
      setLoopSettings(JSON.parse(savedLoopSettings))
    }
  }, [])

  // Save settings to sessionStorage whenever they change
  useEffect(() => {
    sessionStorage.setItem('hedron-render-settings', JSON.stringify(renderSettings))
  }, [renderSettings])

  useEffect(() => {
    sessionStorage.setItem('hedron-loop-settings', JSON.stringify(loopSettings))
  }, [loopSettings])

  return (
    <>
      <button className={`${c.button} ${className}`} onClick={() => setIsOpen(true)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="23 7 16 12 23 17 23 7"></polygon>
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
        </svg>
        Video
      </button>

      {isOpen && (
        <>
          <div className={c.popup}>
            <div className={c.header}>
              <h2 className={c.title}>Video Controls</h2>
              <button className={c.closeButton} onClick={() => setIsOpen(false)}>
                ✕
              </button>
            </div>

            <div className={c.tabsContainer}>
              <div className={c.tabs}>
                <div
                  className={`${c.tab} ${activeTab === 'render' ? c.tabActive : ''}`}
                  onClick={() => setActiveTab('render')}
                >
                  Render Video
                </div>
                <div
                  className={`${c.tab} ${activeTab === 'capture' ? c.tabActive : ''}`}
                  onClick={() => setActiveTab('capture')}
                >
                  Capture Frame
                </div>
                <div
                  className={`${c.tab} ${activeTab === 'loop' ? c.tabActive : ''}`}
                  onClick={() => setActiveTab('loop')}
                >
                  Test Loop
                </div>
              </div>

              {activeTab === 'render' && (
                <RenderTab renderSettings={renderSettings} setRenderSettings={setRenderSettings} />
              )}

              {activeTab === 'capture' && <CaptureTab />}

              {activeTab === 'loop' && (
                <LoopTab loopSettings={loopSettings} setLoopSettings={setLoopSettings} />
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}
