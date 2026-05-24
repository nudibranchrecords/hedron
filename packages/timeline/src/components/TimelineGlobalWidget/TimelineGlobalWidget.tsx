import React from 'react'
import { type HedronEngine } from '@hedron-gl/engine'

import styles from './TimelineGlobalWidget.module.css'

interface TimelineGlobalWidgetProps {
  engine: HedronEngine
  isOpen: boolean
  onToggle: () => void
}

export const TimelineGlobalWidget: React.FC<TimelineGlobalWidgetProps> = ({ isOpen, onToggle }) => {
  return (
    <button
      className={`${styles.timelineGlobalButton} ${isOpen ? styles.active : ''}`}
      onClick={onToggle}
      title="Timeline"
    >
      <span className={styles.icon}>🔹</span>
      <span className={styles.label}>Timeline</span>
    </button>
  )
}
