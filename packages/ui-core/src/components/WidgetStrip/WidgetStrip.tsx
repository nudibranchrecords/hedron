import React, { useState, useMemo } from 'react'
import { HedronEngine } from '@hedron/engine'
import styles from './WidgetStrip.module.css'

// Interface for widget configuration coming from plugin views
interface PluginWidgetConfig {
  widget: React.ComponentType<{
    isOpen: boolean
    onToggle: () => void
    engine: HedronEngine
  }>
  panel?: React.ComponentType<{
    engine: HedronEngine
  }>
}

// Internal widget config used by the WidgetStrip
interface WidgetConfig {
  id: string
  widget: React.ComponentType<{
    isOpen: boolean
    onToggle: () => void
    engine: HedronEngine
  }>
  panel:
    | React.ComponentType<{
        engine: HedronEngine
      }>
    | undefined
}

interface WidgetStripProps {
  engine: HedronEngine
  pluginViews: Record<string, PluginWidgetConfig>
}

export const WidgetStrip: React.FC<WidgetStripProps> = ({ engine, pluginViews }) => {
  const [openPanel, setOpenPanel] = useState<string | null>(null)

  // Convert plugin views to widget configs
  const widgets = useMemo(() => {
    return Object.entries(pluginViews).reduce(
      (acc, [id, config]) => {
        if (config.widget) {
          acc[id] = {
            id,
            widget: config.widget,
            panel: config.panel,
          }
        }
        return acc
      },
      {} as Record<string, WidgetConfig>,
    )
  }, [pluginViews])

  const handleTogglePanel = (widgetId: string) => {
    setOpenPanel(openPanel === widgetId ? null : widgetId)
  }

  // Only render if we have widgets
  const widgetEntries = Object.entries(widgets)

  if (widgetEntries.length === 0) {
    return null
  }

  return (
    <div className={styles.widgetStrip}>
      <div className={styles.widgetContainer}>
        {widgetEntries.map(([id, config]) => {
          const Widget = config.widget
          return (
            <div key={id} className={styles.widgetItem}>
              <Widget
                isOpen={openPanel === id}
                onToggle={() => handleTogglePanel(id)}
                engine={engine}
              />
            </div>
          )
        })}
      </div>

      {openPanel && widgets[openPanel]?.panel && (
        <div className={styles.panelContainer}>
          {React.createElement(widgets[openPanel].panel!, { engine })}
        </div>
      )}
    </div>
  )
}
