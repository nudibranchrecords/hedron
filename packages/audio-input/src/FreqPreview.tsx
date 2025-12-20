import { useEffect, useRef, useState, useCallback } from 'react'
import { AudioInput } from './AudioInput'
import { FREQ_RANGE } from './AudioAnalyzer'
import { freqToX, xToFreq, qToY, yToQ, clamp as clampValue } from './AudioUtils'
import styles from './AudioInputPanel.module.css'

/**
 * FreqPreview is a component that displays a visualization of audio frequency data
 * and allows interactive editing of band parameters
 */
export const FreqPreview = ({ audioPlugin }: { audioPlugin: AudioInput }) => {
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
