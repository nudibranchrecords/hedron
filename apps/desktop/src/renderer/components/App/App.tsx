import {
  AppStoreProvider,
  Collapsible,
  EngineProvider,
  Icon,
  IconName,
  useAppStore,
} from '@hedron-gl/ui-core'
import { useState } from 'react'
import c from './App.module.css'
import { useHandleDrag } from './useHandleDrag'
import { GlobalClock } from '@components/GlobalClock/GlobalClock'
import { GlobalDialogs } from '@components/GlobalDialogs/GlobalDialogs'
import { PerformanceStats } from '@components/PerformanceStats/PerformanceStats'
import { VideoControls } from '@components/VideoControls/VideoControls'
import { Viewer } from '@components/Viewer'
import { WorkArea } from '@components/WorkArea/WorkArea'
import { appStore } from '@renderer/appStore'
import { engine, pluginViews } from '@renderer/engine'

const PluginGlobalControls = () => {
  const [openById, setOpenById] = useState<Record<string, boolean>>({})

  return (
    <div className={c.plugins}>
      {Object.entries(pluginViews.globalPanel).map(([pluginId, PluginPanel]) => {
        const enginePlugin = engine.plugins[pluginId]
        const pluginName = enginePlugin?.name ?? pluginId
        const pluginIconName = enginePlugin?.iconName ?? 'extension'
        const isOpen = openById[pluginId] ?? false

        return (
          <Collapsible
            type="panel"
            className={c.pluginItem}
            key={pluginId}
            title={
              <>
                <Icon name={pluginIconName as IconName} /> {pluginName}
              </>
            }
            isOpen={isOpen}
            onToggle={(nextOpen) =>
              setOpenById((prev) => ({
                ...prev,
                [pluginId]: nextOpen,
              }))
            }
          >
            <PluginPanel engine={engine} />
          </Collapsible>
        )
      })}
    </div>
  )
}

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

            <div className={c.pluginControls}>
              <PluginGlobalControls />
            </div>
          </>
        )}
      </div>
      <div
        className={c.handle}
        onMouseDown={onHandleMouseDown}
        onTouchStart={onHandleMouseDown}
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
