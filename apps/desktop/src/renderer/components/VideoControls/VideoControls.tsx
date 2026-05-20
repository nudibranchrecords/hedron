import { useState, useEffect } from 'react'
import type { ReactElement } from 'react'
import { Button, Icon, MiniTabs, MiniTabsItem } from '@hedron-gl/ui-core'
import c from './VideoControls.module.css'
import { CaptureTab } from './CaptureTab'
import { LoopTab, type LoopSettings } from './LoopTab'
import { RenderTab, type RenderSettings } from './RenderTab'

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

export function VideoControls(): ReactElement {
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
      <Button onClick={() => setIsOpen(true)}>
        <Icon name="panorama"></Icon>Video
      </Button>

      <Button size="short" type="neutral" onClick={() => window.saveFrame()}>
        <Icon name="photo_camera_back"></Icon>Capture
      </Button>

      {isOpen && (
        <>
          <div className={c.popup}>
            <div className={c.header}>
              <h2>Video Controls</h2>
              <Button onClick={() => setIsOpen(false)}>✕</Button>
            </div>

            <MiniTabs>
              <MiniTabsItem
                isActive={activeTab === 'render'}
                iconName="video_camera_back"
                onClick={() => setActiveTab('render')}
              >
                Render Video
              </MiniTabsItem>

              <MiniTabsItem
                isActive={activeTab === 'capture'}
                iconName="photo_camera_back"
                onClick={() => setActiveTab('capture')}
              >
                Capture Frame
              </MiniTabsItem>

              <MiniTabsItem
                isActive={activeTab === 'loop'}
                iconName="360"
                onClick={() => setActiveTab('loop')}
              >
                Test Loop
              </MiniTabsItem>
            </MiniTabs>

            <div className={c.content}>
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
