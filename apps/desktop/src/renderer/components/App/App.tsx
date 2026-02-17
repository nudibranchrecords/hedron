// import { Audio } from '../Audio'
import React, { useRef, useState } from 'react'
import { AppStoreProvider, EngineStoreProvider, WidgetStrip, useAppStore } from '@hedron-gl/ui-core'
import c from './App.module.css'
import { GlobalClock } from '@components/GlobalClock/GlobalClock'
import { GlobalDialogs } from '@components/GlobalDialogs/GlobalDialogs'
import { PerformanceStats } from '@components/PerformanceStats/PerformanceStats'
import { VideoControls } from '@components/VideoControls/VideoControls'
import { Viewer } from '@components/Viewer'
import { WorkArea } from '@components/WorkArea/WorkArea'
import { appStore } from '@renderer/appStore'
import { engine, engineStore, pluginViews } from '@renderer/engine'

const MIN_RATIO = 0.25
const MAX_RATIO = 0.75

const AppContent = (): JSX.Element => {
  const sketchesDir = useAppStore((state) => state.sketchesDir)
  const isProjectLoaded = sketchesDir !== null
  const [leftRatio, setLeftRatio] = useState(0.5)
  const dragging = useRef(false)

  const onMouseDown = () => {
    dragging.current = true
    document.body.style.cursor = 'col-resize'
  }

  React.useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return
      const wrapper = document.getElementById('app-wrapper')
      if (!wrapper) return
      const rect = wrapper.getBoundingClientRect()
      let ratio = (e.clientX - rect.left) / rect.width
      ratio = Math.max(MIN_RATIO, Math.min(MAX_RATIO, ratio))
      setLeftRatio(ratio)
    }
    const onMouseUp = () => {
      if (dragging.current) {
        dragging.current = false
        document.body.style.cursor = ''
      }
    }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  return (
    <div className={c.wrapper} id="app-wrapper">
      <div
        className={c.left}
        style={{ flexBasis: `${leftRatio * 100}%`, maxWidth: `${leftRatio * 100}%` }}
      >
        <Viewer />
        {isProjectLoaded && (
          <>
            <div className={c.widgetStrip}>
              <PerformanceStats />
              <div className={c.widgetItem}>
                <GlobalClock />
              </div>
              <div className={c.widgetItem}>
                <VideoControls />
              </div>
            </div>
            {/* The above widgets need to be converted to plugins */}
            <div className={c.widgetStrip}>
              <WidgetStrip engine={engine} pluginViews={pluginViews.globalPanel} />
            </div>
          </>
        )}
      </div>
      <div
        className={c.handle}
        onMouseDown={onMouseDown}
        role="separator"
        aria-orientation="vertical"
        tabIndex={0}
        title="Resize panels"
      />
      <div className={c.right}>
        <WorkArea />
      </div>
      <GlobalDialogs />
    </div>
  )
}

export const App = (): JSX.Element => {
  return (
    <AppStoreProvider value={appStore}>
      <EngineStoreProvider value={engineStore}>
        <AppContent />
      </EngineStoreProvider>
    </AppStoreProvider>
  )
}
