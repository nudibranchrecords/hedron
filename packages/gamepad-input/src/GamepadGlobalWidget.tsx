import React from 'react'
import { HedronEngine } from '@hedron-gl/engine'
import styles from './GamepadGlobalWidget.module.css'

interface GamepadGlobalWidgetProps {
  engine: HedronEngine
  isOpen: boolean
  onToggle: () => void
}

export const GamepadGlobalWidget: React.FC<GamepadGlobalWidgetProps> = ({ isOpen, onToggle }) => {
  return (
    <button
      className={`${styles.gamepadGlobalButton} ${isOpen ? styles.active : ''}`}
      onClick={onToggle}
      title="Gamepad Global Settings"
    >
      <span className={styles.icon}>🎮</span>
      <span className={styles.label}>Gamepad</span>
    </button>
  )
}
