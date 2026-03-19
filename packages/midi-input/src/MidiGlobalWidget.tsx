import React from 'react'
import { HedronEngine } from '@hedron-gl/engine'
import styles from './MidiGlobalWidget.module.css'

interface MidiGlobalWidgetProps {
  engine: HedronEngine
  isOpen: boolean
  onToggle: () => void
}

export const MidiGlobalWidget: React.FC<MidiGlobalWidgetProps> = ({ isOpen, onToggle }) => {
  return (
    <button
      className={`${styles.midiGlobalButton} ${isOpen ? styles.active : ''}`}
      onClick={onToggle}
      title="MIDI Global Settings"
    >
      <span className={styles.icon}>🎹</span>
      <span className={styles.label}>MIDI</span>
    </button>
  )
}
