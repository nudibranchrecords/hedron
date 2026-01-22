// import { Audio } from '../Audio'
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

const AppContent = (): JSX.Element => {
  const sketchesDir = useAppStore((state) => state.sketchesDir)
  const isProjectLoaded = sketchesDir !== null

  return (
    <div className={c.wrapper}>
      <div className={c.left}>
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
