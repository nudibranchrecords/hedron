import React from 'react'
import { HedronEngine } from '@hedron-gl/engine'
import { ControlGrid, NodeContainer } from '@hedron-gl/ui-core'
import { AudioInput } from './AudioInput'
import styles from './AudioGlobalPanel.module.css'
import { AudioDebugPanel } from './AudioDebugPanel'
import { FreqPreview } from './FreqPreview'
import { AudioInputSelector } from './AudioInputSelector'

interface AudioGlobalPanelProps {
  engine: HedronEngine
}

export const AudioGlobalPanel: React.FC<AudioGlobalPanelProps> = ({ engine }) => {
  const audioPlugin = engine.plugins[AudioInput.ID] as AudioInput | undefined

  // If plugin is not available, show an error message
  if (!audioPlugin) {
    return <div className={styles.errorPanel}>Audio plugin not available</div>
  }

  // Get global option node IDs
  const globalOptionNodeIds = engine.getPluginGlobalOptionNodeIds(AudioInput.ID)

  // If no global option nodes are found, display a message
  if (globalOptionNodeIds.length === 0) {
    return <div className={styles.errorPanel}>No global audio settings available</div>
  }

  return (
    <div>
      <AudioInputSelector audioPlugin={audioPlugin} />
      <FreqPreview audioPlugin={audioPlugin} />
      <ControlGrid className={styles.controlGrid}>
        {globalOptionNodeIds.map((id: string) => (
          <NodeContainer key={id} nodeId={id} />
        ))}
      </ControlGrid>
      <AudioDebugPanel audioPlugin={audioPlugin} />
    </div>
  )
}
