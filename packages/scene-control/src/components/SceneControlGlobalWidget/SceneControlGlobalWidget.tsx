import React from 'react'
import { HedronEngine } from '@hedron-gl/engine'
import styles from './SceneControlGlobalWidget.module.css'

interface SceneControlGlobalWidgetProps {
  engine: HedronEngine
  isOpen: boolean
  onToggle: () => void
}

export const SceneControlGlobalWidget: React.FC<SceneControlGlobalWidgetProps> = ({
  isOpen,
  onToggle,
}) => {
  return (
    <button
      className={`${styles.sceneControlButton} ${isOpen ? styles.active : ''}`}
      onClick={onToggle}
      title="Scene Controls"
    >
      <span className={styles.label}>Scenes</span>
    </button>
  )
}
