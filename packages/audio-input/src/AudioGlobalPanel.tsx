import React from 'react'
import { HedronEngine } from '@hedron/engine'
import { AudioInput } from './AudioInput'
import { ControlGrid, Param } from '@hedron/ui-core'
import styles from './AudioGlobalPanel.module.css'
import { AudioDebugPanel } from './AudioDebugPanel'
import { FreqPreview } from './FreqPreview'
import { AudioInputSelector } from './AudioInputSelector'

interface AudioGlobalPanelProps {
  engine: HedronEngine
}

export const AudioGlobalPanel: React.FC<AudioGlobalPanelProps> = ({ engine }) => {
  const audioPlugin = engine.plugins[AudioInput.ID] as AudioInput | undefined
  const [ensuredNodes, setEnsuredNodes] = React.useState(false)

  // If plugin is not available, show an error message
  if (!audioPlugin) {
    return <div className={styles.errorPanel}>Audio plugin not available</div>
  }

  // Ensure global option nodes exist when the panel is opened
  React.useEffect(() => {
    if (!ensuredNodes) {
      // This will recreate global option nodes if they don't exist
      engine.recreateGlobalOptionNodes()
      setEnsuredNodes(true)
    }
  }, [engine, ensuredNodes])

  // Get global option node IDs
  const globalOptionNodeIds = engine.getPluginGlobalOptionNodeIds(AudioInput.ID)

  // If no global option nodes are found, display a message
  if (globalOptionNodeIds.length === 0) {
    return <div className={styles.errorPanel}>No global audio settings available</div>
  }

  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>Audio Global Settings</h3>
      <AudioInputSelector audioPlugin={audioPlugin} />
      <FreqPreview audioPlugin={audioPlugin} />
      <ControlGrid className={styles.controlGrid}>
        {globalOptionNodeIds.map((id: string) => (
          <Param key={id} paramId={id} />
        ))}
      </ControlGrid>
      <AudioDebugPanel audioPlugin={audioPlugin} />
    </div>
  )
}
