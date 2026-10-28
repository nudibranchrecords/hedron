import {
  AppStoreProvider,
  Collapsible,
  EngineProvider,
  HedronErrorBoundary,
  LocalPathPickerProvider,
  Icon,
  IconName,
  useAppStore,
} from '@hedron-gl/ui-core'
import { useState } from 'react'
import c from './App.module.css'
import { useHandleDrag } from './useHandleDrag'
import { GlobalDialogs } from '@components/GlobalDialogs/GlobalDialogs'
import { PerformanceStats } from '@components/PerformanceStats/PerformanceStats'
import { Viewer } from '@components/Viewer'
import { WorkArea } from '@components/WorkArea/WorkArea'
import { appStore } from '@renderer/appStore'
import { engine } from '@renderer/engine'
import { selectLocalPath } from '@renderer/ipc/mainThreadTalk'
import { usePluginViews, viewKey } from '@renderer/plugins/pluginViews'
import { PluginManagerPanel } from '@components/PluginManagerPanel/PluginManagerPanel'

const PluginGlobalControls = () => {
  const [openById, setOpenById] = useState<Record<string, boolean>>({})
  const [isManagerOpen, setIsManagerOpen] = useState(false)
  const globalPanels = usePluginViews((state) => state.globalPanel)

  return (
    <div className={c.plugins}>
      {Object.entries(globalPanels).map(([pluginId, PluginPanel]) => {
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
            {/* Keyed on the component so a reloaded plugin gets a fresh error boundary */}
            <HedronErrorBoundary key={viewKey(PluginPanel)}>
              <PluginPanel engine={engine} />
            </HedronErrorBoundary>
          </Collapsible>
        )
      })}
      <Collapsible
        type="panel"
        className={c.pluginItem}
        title={
          <>
            <Icon name="extension" /> Plugins
          </>
        }
        isOpen={isManagerOpen}
        onToggle={setIsManagerOpen}
      >
        <PluginManagerPanel />
      </Collapsible>
    </div>
  )
}

const AppContent = (): JSX.Element => {
  const sketchesDir = useAppStore((state) => state.sketchesDir)
  const isProjectLoaded = sketchesDir !== null
  const widgets = usePluginViews((state) => state.widget)

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
              {Object.entries(widgets).map(([pluginId, PluginWidget]) => (
                <div className={c.widgetItem} key={pluginId}>
                  <HedronErrorBoundary key={viewKey(PluginWidget)}>
                    <PluginWidget />
                  </HedronErrorBoundary>
                </div>
              ))}
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
        <LocalPathPickerProvider value={selectLocalPath}>
          <AppContent />
        </LocalPathPickerProvider>
      </EngineProvider>
    </AppStoreProvider>
  )
}
