import React from 'react'
import { HedronEngine } from '@hedron/engine'
import { AudioInput } from './AudioInput'
import styles from './AudioGlobalWidget.module.css'

interface AudioGlobalWidgetProps {
  engine: HedronEngine
  isOpen: boolean
  onToggle: () => void
}

export const AudioGlobalWidget: React.FC<AudioGlobalWidgetProps> = ({ isOpen, onToggle }) => {
  return (
    <button
      className={`${styles.audioGlobalButton} ${isOpen ? styles.active : ''}`}
      onClick={onToggle}
      title="Audio Global Settings"
    >
      <span className={styles.icon}>🔊</span>
      <span className={styles.label}>Audio</span>
    </button>
  )
}
