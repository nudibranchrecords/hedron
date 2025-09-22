import { HedronEngine, Input, IPlugin } from '@hedron/engine'
import { ControlGrid, Param } from '@hedron/ui-core'
import { useEffect, useRef, useState, useCallback } from 'react'
import { AudioInput } from './AudioInput'
import { FREQ_RANGE } from './AudioAnalyzer'
import { AudioDebugPanel } from './AudioDebugPanel'
import {
  freqToX,
  xToFreq,
  qToY,
  yToQ,
  calculateAverageLevel,
  getLevelColor,
  playTestTone,
  clamp as clampValue,
} from './AudioUtils'
import styles from './AudioInputPanel.module.css'

// Using the imported clamp function as clampValue

interface IProps {
  input: Input
  // TODO: This can be typed as something like HedronEngineWithPlugin<AudioInput>
  engine: HedronEngine
}

/**
 * FreqPreview is a component that displays a visualization of audio frequency data
 * and allows interactive editing of band parameters
 */
const FreqPreview = ({ audioPlugin }: { audioPlugin: AudioInput }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedBand, setSelectedBand] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  // Using imported utility functions

  // Draw function for the canvas
  const drawVisualization = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !audioPlugin?.audioData) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // Clear the canvas
    ctx.clearRect(0, 0, width, height)

    // Draw frequency spectrum background
    const spectrum = audioPlugin.analyzer.fullLevelsData
    if (spectrum && spectrum.length > 0) {
      ctx.beginPath()
      ctx.moveTo(0, height)

      for (let i = 0; i < spectrum.length; i++) {
        // Skip frequencies outside our range
        const freq = audioPlugin.analyzer.nyquist * (i / spectrum.length)
        if (freq < FREQ_RANGE.MIN || freq > FREQ_RANGE.MAX) continue

        const x = freqToX(freq, width, FREQ_RANGE.MIN, FREQ_RANGE.MAX)
        const y = height - spectrum[i] * height
        ctx.lineTo(x, y)
      }

      ctx.lineTo(width, height)
      ctx.closePath()

      // Fill with gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, height)
      gradient.addColorStop(0, 'rgba(75, 75, 75, 0.8)')
      gradient.addColorStop(1, 'rgba(30, 30, 30, 0.2)')
      ctx.fillStyle = gradient
      ctx.fill()
    }

    // Draw frequency grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.lineWidth = 1

    // Draw frequency markers (logarithmically spaced)
    const freqMarkers = [50, 100, 200, 500, 1000, 2000, 5000, 10000]
    for (const freq of freqMarkers) {
      if (freq >= FREQ_RANGE.MIN && freq <= FREQ_RANGE.MAX) {
        const x = freqToX(freq, width, FREQ_RANGE.MIN, FREQ_RANGE.MAX)
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()

        // Label
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
        ctx.font = '9px sans-serif'
        ctx.textAlign = 'center'
        const label = freq >= 1000 ? `${freq / 1000}k` : `${freq}`
        ctx.fillText(label, x, height - 5)
      }
    }

    // Draw each band response curve
    for (let i = 0; i < audioPlugin.analyzer.bands.length; i++) {
      const band = audioPlugin.analyzer.bands[i]
      const color = band.color
      const responseCurve = audioPlugin.analyzer.getBandResponseCurve(i, width)

      // Draw the curve
      ctx.beginPath()

      for (let j = 0; j < responseCurve.length; j++) {
        const x = (j / (responseCurve.length - 1)) * width
        const y = height - responseCurve[j] * height * 0.8

        if (j === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }

      // Style for curve
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw the control handle
      const handleX = freqToX(band.centerFreq, width, FREQ_RANGE.MIN, FREQ_RANGE.MAX)
      const handleY = qToY(band.q, height)

      // Highlight selected band
      if (i === selectedBand) {
        ctx.beginPath()
        ctx.arc(handleX, handleY, 12, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
        ctx.fill()
      }

      ctx.beginPath()
      ctx.arc(handleX, handleY, 8, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.fill()
      ctx.strokeStyle = 'white'
      ctx.lineWidth = 1
      ctx.stroke()
    }

    // Draw current audio levels for each band
    for (let i = 0; i < audioPlugin.analyzer.bands.length; i++) {
      const band = audioPlugin.analyzer.bands[i]
      const level = audioPlugin.analyzer.levelsData[i] || 0

      const centerX = freqToX(band.centerFreq, width, FREQ_RANGE.MIN, FREQ_RANGE.MAX)
      const barHeight = level * height * 0.8
      const barWidth = 6

      // Draw bar
      ctx.fillStyle = `${band.color}88`
      ctx.fillRect(centerX - barWidth / 2, height - barHeight, barWidth, barHeight)
    }

    // Draw selected band info
    if (selectedBand !== null) {
      const band = audioPlugin.analyzer.bands[selectedBand]
      const color = band.color

      ctx.fillStyle = color
      ctx.font = 'bold 12px sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText(
        `${['Low', 'Mid Low', 'Mid High', 'High'][selectedBand] || selectedBand}: ${Math.round(band.centerFreq)}Hz, Q=${band.q.toFixed(1)}`,
        10,
        20,
      )
    }
  }, [audioPlugin, selectedBand])

  // Handle mouse events for interactive controls
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const canvas = canvasRef.current
      if (!canvas || !audioPlugin) return

      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const width = canvas.width
      const height = canvas.height

      // Check if clicked on a band handle
      for (let i = 0; i < audioPlugin.analyzer.bands.length; i++) {
        const band = audioPlugin.analyzer.bands[i]
        const handleX = freqToX(band.centerFreq, width, FREQ_RANGE.MIN, FREQ_RANGE.MAX)
        const handleY = qToY(band.q, height)

        // Calculate distance to handle
        const distance = Math.sqrt(Math.pow(x - handleX, 2) + Math.pow(y - handleY, 2))

        // If clicked near enough to a handle
        if (distance < 15) {
          setSelectedBand(i)
          setIsDragging(true)
          return
        }
      }
    },
    [audioPlugin],
  )

  // This function handles both canvas mouse move and document mouse move
  const handleMouseMove = useCallback(
    (e: MouseEvent | React.MouseEvent) => {
      if (!isDragging || selectedBand === null) return

      const canvas = canvasRef.current
      if (!canvas || !audioPlugin) return

      const rect = canvas.getBoundingClientRect()

      // Get mouse coordinates
      const { clientX, clientY } = e

      // Calculate position relative to canvas - may be outside bounds
      const rawX = clientX - rect.left
      const rawY = clientY - rect.top

      // Get canvas dimensions
      const width = canvas.width
      const height = canvas.height

      // Clamp position to canvas bounds
      const x = clampValue(rawX, 0, width)
      const y = clampValue(rawY, 0, height)

      // Convert position to frequency and Q
      const freq = xToFreq(x, width, FREQ_RANGE.MIN, FREQ_RANGE.MAX)
      const q = yToQ(y, height)

      // Update the band
      audioPlugin.updateBand(selectedBand, freq, q)
    },
    [audioPlugin, isDragging, selectedBand],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Add global mouse event handlers for dragging outside the canvas
  useEffect(() => {
    if (!isDragging) return

    // Use document-level event listeners when dragging
    const handleDocumentMouseMove = (e: MouseEvent) => {
      handleMouseMove(e)
    }

    const handleDocumentMouseUp = () => {
      setIsDragging(false)
    }

    // Add document-level event listeners
    document.addEventListener('mousemove', handleDocumentMouseMove)
    document.addEventListener('mouseup', handleDocumentMouseUp)

    // Clean up event listeners when dragging stops or component unmounts
    return () => {
      document.removeEventListener('mousemove', handleDocumentMouseMove)
      document.removeEventListener('mouseup', handleDocumentMouseUp)
    }
  }, [isDragging, handleMouseMove])

  // Animation loop
  useEffect(() => {
    if (!audioPlugin?.audioData) return

    const canvas = canvasRef.current
    if (!canvas) return

    // Set canvas size to match container
    const resizeCanvas = () => {
      const container = containerRef.current
      if (!container) return

      const { width, height } = container.getBoundingClientRect()
      canvas.width = width
      canvas.height = height
    }

    // Initial resize
    resizeCanvas()

    // Handle window resize
    window.addEventListener('resize', resizeCanvas)

    // Animation loop
    const animate = () => {
      drawVisualization()
      animationRef.current = requestAnimationFrame(animate)
    }

    const animationRef = { current: requestAnimationFrame(animate) }

    // Cleanup
    return () => {
      cancelAnimationFrame(animationRef.current)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [audioPlugin, drawVisualization])

  return (
    <div ref={containerRef} className={styles.freqPreviewContainer}>
      <canvas
        ref={canvasRef}
        className={styles.freqPreviewCanvas}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      {/* Add instructions text */}
      <div className={styles.freqPreviewInstructions}>
        Drag circles to adjust frequency (x) and Q factor (y)
      </div>
    </div>
  )
}

/**
 * A react component that displays the audio settings for a parameter
 * Includes a visualization of the audio frequency data
 */
export const AudioInputPanel = ({ input, engine }: IProps) => {
  // Get the AudioInput plugin instance from the engine
  const audioPlugin = engine.plugins[AudioInput.ID] as AudioInput | undefined

  // Log selected frequency band from input options
  const frequencyOption = input.optionNodeIds.find((id) => id.includes('frequency'))
  if (frequencyOption) {
    console.log('[AudioInputPanel] Selected frequency band option:', frequencyOption)
  }

  // Add state for test tone and volume level
  const [testToneActive, setTestToneActive] = useState(false)
  const [testToneFreq, setTestToneFreq] = useState(440) // Default to A4 (440Hz)
  const [testToneVolume, setTestToneVolume] = useState(0.5)
  const [audioLevel, setAudioLevel] = useState(0)
  const [isRefreshingDevices, setIsRefreshingDevices] = useState(false)
  const [isChangingDevice, setIsChangingDevice] = useState(false)
  const [deviceChangeError, setDeviceChangeError] = useState<string | null>(null)
  const oscillatorRef = useRef<OscillatorNode | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)

  // Start/stop test tone using shared utility
  const toggleTestTone = useCallback(() => {
    if (!audioPlugin) return

    if (!testToneActive) {
      try {
        // Use shared test tone utility (with no duration for continuous play)
        const tone = playTestTone({
          frequency: testToneFreq,
          volume: testToneVolume,
          type: 'sine',
        })

        // If it's a tone control object (not a Promise)
        if (tone instanceof Promise) {
          // This shouldn't happen without a duration, but just in case
          tone.catch((error) => {
            console.error('[AudioInputPanel] Test tone error:', error)
          })
        } else {
          // Store references
          oscillatorRef.current = tone.oscillator
          gainNodeRef.current = tone.gainNode

          setTestToneActive(true)
          console.log(`[AudioInputPanel] Test tone started at ${testToneFreq}Hz`)
        }
      } catch (error) {
        console.error('[AudioInputPanel] Error starting test tone:', error)
      }
    } else {
      // Stop oscillator
      if (oscillatorRef.current) {
        oscillatorRef.current.stop()
        oscillatorRef.current = null
        gainNodeRef.current = null
        setTestToneActive(false)
        console.log('[AudioInputPanel] Test tone stopped')
      }
    }
  }, [audioPlugin, testToneActive, testToneFreq, testToneVolume])

  // Update test tone parameters when they change
  useEffect(() => {
    if (testToneActive && oscillatorRef.current) {
      oscillatorRef.current.frequency.value = testToneFreq
      if (gainNodeRef.current) {
        gainNodeRef.current.gain.value = testToneVolume
      }
    }
  }, [testToneActive, testToneFreq, testToneVolume])

  // Clean up oscillator on unmount
  useEffect(() => {
    return () => {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop()
      }
    }
  }, [])

  // Monitor audio level using shared utility
  useEffect(() => {
    if (!audioPlugin) return

    const interval = setInterval(() => {
      if (audioPlugin.analyzer.levelsData && audioPlugin.analyzer.levelsData.length > 0) {
        // Calculate average level across all bands using shared utility
        const avgLevel = calculateAverageLevel(audioPlugin.analyzer.levelsData)
        setAudioLevel(avgLevel)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [audioPlugin])

  // Monitor for device changes
  useEffect(() => {
    if (!audioPlugin) return

    // Update device list when devices change
    const handleDeviceChange = async () => {
      console.log('[AudioInputPanel] Device change detected, updating input device list')
      await audioPlugin.updateInputDeviceList()
    }

    // Listen for device changes
    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange)

    // Cleanup listener
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange)
    }
  }, [audioPlugin])

  return (
    <div>
      {audioPlugin?.audioData ? (
        <>
          <FreqPreview audioPlugin={audioPlugin} />

          {/* Audio Status & Controls */}
          <div className={styles.audioStatusContainer}>
            <div>
              <div className={styles.audioStatusText}>
                Audio Status: <span className={styles.audioStatusActive}>Active</span>
              </div>

              {/* Audio Input Device Selector */}
              <div className={styles.audioDeviceContainer}>
                <div className={styles.audioDeviceLabel}>Input Device:</div>
                <div className={styles.audioDeviceControls}>
                  <select
                    value={audioPlugin.deviceManager.currentDeviceId}
                    onChange={async (e) => {
                      if (!audioPlugin) return

                      // Clear previous errors
                      setDeviceChangeError(null)

                      try {
                        setIsChangingDevice(true)
                        const success = await audioPlugin.changeAudioInputDevice(e.target.value)

                        if (!success) {
                          setDeviceChangeError('Failed to switch device')
                        }
                      } catch (error) {
                        console.error('[AudioInputPanel] Error changing device:', error)
                        setDeviceChangeError(
                          error instanceof Error ? error.message : 'Unknown error',
                        )
                      } finally {
                        setIsChangingDevice(false)
                      }
                    }}
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
                    onClick={async () => {
                      if (!audioPlugin) return

                      // Clear previous errors
                      setDeviceChangeError(null)

                      try {
                        setIsRefreshingDevices(true)
                        await audioPlugin.updateInputDeviceList()
                      } catch (error) {
                        console.error('[AudioInputPanel] Error refreshing devices:', error)
                        setDeviceChangeError(
                          error instanceof Error ? error.message : 'Unknown error',
                        )
                      } finally {
                        setIsRefreshingDevices(false)
                      }
                    }}
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
                {deviceChangeError && (
                  <div className={styles.audioDeviceErrorText}>{deviceChangeError}</div>
                )}
                {isChangingDevice && (
                  <div className={styles.audioDeviceChangingText}>Changing audio device...</div>
                )}
              </div>

              {/* Audio Level Meter */}
              <div className={styles.audioLevelContainer}>
                <span className={styles.audioLevelLabel}>Level:</span>
                <div className={styles.audioLevelMeter}>
                  <div
                    className={styles.audioLevelValue}
                    style={{
                      width: `${audioLevel * 100}%`,
                      backgroundColor: getLevelColor(audioLevel),
                    }}
                  />
                </div>
                <span className={styles.audioLevelText}>{(audioLevel * 100).toFixed(0)}%</span>
              </div>
            </div>

            {/* Test Tone Controls */}
            <div className={styles.testToneContainer}>
              <button
                onClick={toggleTestTone}
                className={`${styles.testToneButton} ${
                  testToneActive ? styles.testToneButtonActive : styles.testToneButtonInactive
                }`}
              >
                {testToneActive ? 'Stop Tone' : 'Test Tone'}
              </button>

              {testToneActive && (
                <>
                  <div className={styles.testToneControlContainer}>
                    <label className={styles.testToneControlLabel}>Freq: {testToneFreq}Hz</label>
                    <input
                      type="range"
                      min="50"
                      max="5000"
                      step="10"
                      value={testToneFreq}
                      onChange={(e) => setTestToneFreq(Number(e.target.value))}
                      className={styles.testToneControlSlider}
                    />
                  </div>
                  <div className={styles.testToneControlContainer}>
                    <label className={styles.testToneControlLabel}>
                      Vol: {(testToneVolume * 100).toFixed(0)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={testToneVolume}
                      onChange={(e) => setTestToneVolume(Number(e.target.value))}
                      className={styles.testToneControlSlider}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className={styles.audioErrorMessage}>
          Audio input not available. Check console for details.
        </div>
      )}

      <ControlGrid className="mb-xl">
        {input.optionNodeIds.map((id) => (
          <Param key={id} paramId={id} />
        ))}
      </ControlGrid>

      {/* Debug Panel */}
      <AudioDebugPanel audioPlugin={audioPlugin} />
    </div>
  )
}
