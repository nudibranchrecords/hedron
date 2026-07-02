import { AppStoreProvider, EngineProvider, WidgetStrip, useAppStore } from '@hedron-gl/ui-core'
import c from './App.module.css'
import { useHandleDrag } from './useHandleDrag'
import { GlobalClock } from '@components/GlobalClock/GlobalClock'
import { GlobalDialogs } from '@components/GlobalDialogs/GlobalDialogs'
import { PerformanceStats } from '@components/PerformanceStats/PerformanceStats'
import { VideoControls } from '@components/VideoControls/VideoControls'
import { Viewer } from '@components/Viewer'
import { WorkArea } from '@components/WorkArea/WorkArea'
import { Scenes } from '@components/Scenes/Scenes'
import { appStore } from '@renderer/appStore'
import { engine, pluginViews } from '@renderer/engine'

const AppContent = (): JSX.Element => {
  const sketchesDir = useAppStore((state) => state.sketchesDir)
  const isProjectLoaded = sketchesDir !== null

  const { leftRatio, onHandleMouseDown, wrapperRef } = useHandleDrag()

  return (
    <div className={c.wrapper} ref={wrapperRef}>
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
            <div className={c.pluginWidgetStrip}>
              <WidgetStrip engine={engine} pluginViews={pluginViews.globalPanel} />
            </div>
            <Scenes />
          </>
        )}
      </div>
      <div
        className={c.handle}
        onMouseDown={onHandleMouseDown}
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
      <EngineProvider value={engine}>
        <AppContent />
      </EngineProvider>
    </AppStoreProvider>
  )
}
