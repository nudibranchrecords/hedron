import { useState, useEffect } from 'react'
import { AudioInput } from './AudioInput'
import styles from './AudioInputPanel.module.css'

interface AudioInputSelectorProps {
  audioPlugin: AudioInput
}

/**
 * AudioInputSelector is a component that allows users to select and manage audio input devices
 */
export const AudioInputSelector = ({ audioPlugin }: AudioInputSelectorProps) => {
  const [isRefreshingDevices, setIsRefreshingDevices] = useState(false)
  const [isChangingDevice, setIsChangingDevice] = useState(false)
  const [deviceChangeError, setDeviceChangeError] = useState<string | null>(null)

  // Monitor for device changes
  useEffect(() => {
    if (!audioPlugin) return

    // Update device list when devices change
    const handleDeviceChange = async () => {
      console.log('[AudioInputSelector] Device change detected, updating input device list')
      await audioPlugin.updateInputDeviceList()
    }

    // Listen for device changes
    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange)

    // Cleanup listener
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange)
    }
  }, [audioPlugin])

  const handleDeviceChange = async (deviceId: string) => {
    if (!audioPlugin) return

    // Clear previous errors
    setDeviceChangeError(null)

    try {
      setIsChangingDevice(true)
      const success = await audioPlugin.changeAudioInputDevice(deviceId)

      if (!success) {
        setDeviceChangeError('Failed to switch device')
      }
    } catch (error) {
      console.error('[AudioInputSelector] Error changing device:', error)
      setDeviceChangeError(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setIsChangingDevice(false)
    }
  }

  const handleRefreshDevices = async () => {
    if (!audioPlugin) return

    // Clear previous errors
    setDeviceChangeError(null)

    try {
      setIsRefreshingDevices(true)
      await audioPlugin.updateInputDeviceList()
    } catch (error) {
      console.error('[AudioInputSelector] Error refreshing devices:', error)
      setDeviceChangeError(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setIsRefreshingDevices(false)
    }
  }

  return (
    <div className={styles.audioDeviceContainer}>
      <div className={styles.audioDeviceControls}>
        <div className={styles.audioDeviceLabel}>Input Device:</div>
        <select
          value={audioPlugin.deviceManager.currentDeviceId}
          onChange={(e) => handleDeviceChange(e.target.value)}
          className={`${styles.audioDeviceSelect} 
                    ${deviceChangeError ? styles.audioDeviceSelectError : styles.audioDeviceSelectNormal} 
                    ${isChangingDevice ? styles.audioDeviceSelectDisabled : ''}`}
          disabled={isChangingDevice || isRefreshingDevices}
        >
          <option value="default">System Default</option>
          {audioPlugin.deviceManager.availableInputDevices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Device (${device.deviceId.slice(0, 8)}...)`}
            </option>
          ))}
        </select>
        <button
          onClick={handleRefreshDevices}
          className={`${styles.audioDeviceRefreshButton} ${
            isRefreshingDevices
              ? styles.audioDeviceRefreshButtonActive
              : styles.audioDeviceRefreshButtonNormal
          }`}
          disabled={isRefreshingDevices || isChangingDevice}
        >
          {isRefreshingDevices ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      {deviceChangeError && <div className={styles.audioDeviceErrorText}>{deviceChangeError}</div>}
      {isChangingDevice && (
        <div className={styles.audioDeviceChangingText}>Changing audio device...</div>
      )}
    </div>
  )
}
