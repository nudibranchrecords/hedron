import React from 'react'
import { HedronEngine } from '@hedron-gl/engine'
import { ControlGrid, NodeContainer, useNodeOptionNodes } from '@hedron-gl/ui-core'
import { AudioGlobalOptionNodes, AudioInput } from './AudioInput'
import styles from './AudioGlobalPanel.module.css'
import { AudioDebugPanel } from './AudioDebugPanel'
import { FreqPreview } from './FreqPreview'
import { AudioInputSelector } from './AudioInputSelector'
import { AUDIO_INPUT_NODE_ID } from './constants'

interface AudioGlobalPanelProps {
  engine: HedronEngine
}

export const AudioGlobalPanel: React.FC<AudioGlobalPanelProps> = ({ engine }) => {
  const audioPlugin = engine.plugins[AudioInput.ID] as AudioInput | undefined
  const globalOptionNodes = useNodeOptionNodes<AudioGlobalOptionNodes>(AUDIO_INPUT_NODE_ID)
  const visibleNodes = Object.values(globalOptionNodes).filter((node) => node && !node.hidden)

  // If plugin is not available, show an error message
  if (!audioPlugin) {
    return <div className={styles.errorPanel}>Audio plugin not available</div>
  }

  // If no global option nodes are found, display a message
  if (visibleNodes.length === 0) {
    return <div className={styles.errorPanel}>No global audio settings available</div>
  }

  return (
    <div>
      <AudioInputSelector audioPlugin={audioPlugin} />
      <FreqPreview audioPlugin={audioPlugin} />
      <ControlGrid className={styles.controlGrid}>
        {visibleNodes.map((node) => node && <NodeContainer key={node.id} nodeId={node.id} />)}
      </ControlGrid>
      <AudioDebugPanel audioPlugin={audioPlugin} />
    </div>
  )
}
