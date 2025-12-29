/**
 * Audio Test Utilities
 * Helper functions for debugging and testing audio functionality
 */
import React from 'react'
import { createAudioContext } from './AudioUtils'
import styles from './AudioGlobalPanel.module.css'
import { AudioInput } from './AudioInput'

/**
 * Generates diagnostic information about the audio system
 * @returns A React element with formatted diagnostic information
 */
export async function getAudioDiagnostics(): Promise<React.ReactElement> {
  const lines: string[] = []
  lines.push('=== AUDIO DIAGNOSTICS ===')
  // Check if Web Audio API is available
  lines.push('🔍 Web Audio API Support:')
  if (
    typeof window.AudioContext !== 'undefined' ||
    typeof (window as any).webkitAudioContext !== 'undefined'
  ) {
    lines.push('✅ Web Audio API is supported')
  } else {
    lines.push('❌ Web Audio API is NOT supported')
  }

  // Check if MediaDevices API is available
  lines.push('\n🔍 MediaDevices API Support:')
  if (navigator.mediaDevices) {
    lines.push('✅ MediaDevices API is supported')

    // Try to list available audio devices
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const audioInputDevices = devices.filter((device) => device.kind === 'audioinput')
      lines.push(`✅ Found ${audioInputDevices.length} audio input device(s)`)

      if (audioInputDevices.length > 0) {
        lines.push('\n📱 Audio Input Devices:')
        audioInputDevices.forEach((device, index) => {
          lines.push(`  ${index + 1}. ${device.label || 'Unnamed device'}`)
        })
      } else {
        lines.push('❌ No audio input devices detected')
      }
    } catch (err) {
      lines.push(`❌ Error enumerating devices: ${err}`)
    }
  } else {
    lines.push('❌ MediaDevices API is NOT supported')
  }

  // Check user media permissions
  lines.push('\n🔍 Microphone Permission:')
  try {
    lines.push('⏳ Requesting microphone permission...')

    // Try to get permission with minimal access
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
      },
    })

    // Get track information
    const tracks = stream.getAudioTracks()
    lines.push(`✅ Permission granted! Captured ${tracks.length} audio track(s)`)

    if (tracks.length > 0) {
      const track = tracks[0]
      const settings = track.getSettings()

      lines.push('\n🎤 Audio Track Details:')
      lines.push(`  - Label: ${track.label}`)
      lines.push(`  - Sample Rate: ${settings.sampleRate || 'unknown'}Hz`)
      lines.push(`  - Echo Cancellation: ${settings.echoCancellation ? 'enabled' : 'disabled'}`)
      lines.push(`  - Noise Suppression: ${settings.noiseSuppression ? 'enabled' : 'disabled'}`)
      lines.push(`  - Auto Gain Control: ${settings.autoGainControl ? 'enabled' : 'disabled'}`)
    }

    // Test if we can create analyzer
    const audioContext = createAudioContext()
    const analyser = audioContext.createAnalyser()
    const source = audioContext.createMediaStreamSource(stream)
    source.connect(analyser)

    lines.push('\n🔊 Analyzer Created:')
    lines.push(`  - FFT Size: ${analyser.fftSize}`)
    lines.push(`  - Frequency Bins: ${analyser.frequencyBinCount}`)
    lines.push(`  - Sample Rate: ${audioContext.sampleRate}Hz`)

    // Create buffer to test analysis
    const buffer = new Uint8Array(analyser.frequencyBinCount)
    analyser.getByteFrequencyData(buffer)

    // Close the audio context and stop tracks to clean up resources
    source.disconnect()
    audioContext.close()
    tracks.forEach((track) => track.stop())

    lines.push('✅ Analyzer test successful')
  } catch (err) {
    if (err instanceof DOMException) {
      if (err.name === 'NotAllowedError') {
        lines.push('❌ Microphone permission was denied by the user or system')
      } else if (err.name === 'NotFoundError') {
        lines.push('❌ No microphone device found')
      } else {
        lines.push(`❌ Error accessing microphone: ${err.name} - ${err.message}`)
      }
    } else {
      lines.push(`❌ Unexpected error: ${err}`)
    }
  }

  // Check browser information
  const ua = navigator.userAgent
  lines.push('\n🔍 Browser Information:')
  lines.push(`  - User Agent: ${ua}`)

  // Check for mobile devices
  const isMobile = /iPhone|iPad|iPod|Android/i.test(ua)
  if (isMobile) {
    lines.push('  - Device Type: Mobile (may have more restricted audio access)')
  } else {
    lines.push('  - Device Type: Desktop')
  }

  return <div className={styles.testResultsMonospace}>{lines.join('\n')}</div>
}

/**
 * Tests the audio input capture system and returns diagnostic information
 * @returns Promise with a React element showing test results
 */
export async function testAudioInputCapture(): Promise<React.ReactElement> {
  try {
    // First check if media devices API is available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return (
        <div>
          <h4 style={{ margin: '0 0 8px 0', color: '#FF5252' }}>Audio Input Test Results</h4>
          <div style={{ marginBottom: '6px' }}>MediaDevices API not available in this browser</div>
        </div>
      )
    }

    // List available devices
    const devices = await navigator.mediaDevices.enumerateDevices()
    const audioInputDevices = devices.filter((device) => device.kind === 'audioinput')

    if (audioInputDevices.length === 0) {
      return (
        <div>
          <h4 style={{ margin: '0 0 8px 0', color: '#FF5252' }}>Audio Input Test Results</h4>
          <div style={{ marginBottom: '6px' }}>No audio input devices detected</div>
          <div>Devices detected: 0</div>
        </div>
      )
    }

    // Request access to the microphone
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const audioTrack = stream.getAudioTracks()[0]

    // Create audio context and analyzer
    const audioContext = createAudioContext()
    const analyser = audioContext.createAnalyser()
    analyser.fftSize = 2048
    analyser.smoothingTimeConstant = 0.2

    // Connect the audio source to the analyzer
    const source = audioContext.createMediaStreamSource(stream)
    source.connect(analyser)

    // Create buffer for frequency data
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    // Measure noise floor (minimum level)
    let noiseFloor = 256
    let peakLevel = 0
    let samplesCollected = 0
    const maxSamples = 20

    return new Promise((resolve) => {
      // Sample the audio input multiple times
      const intervalId = setInterval(() => {
        analyser.getByteFrequencyData(dataArray)

        // Calculate average and peak levels
        let peak = 0
        for (let i = 0; i < bufferLength; i++) {
          const value = dataArray[i]
          peak = Math.max(peak, value)

          // Update noise floor (minimum level detected)
          if (value > 0) {
            noiseFloor = Math.min(noiseFloor, value)
          }
        }

        // Track peak level
        peakLevel = Math.max(peakLevel, peak)

        samplesCollected++

        // Once we've collected enough samples, return the results
        if (samplesCollected >= maxSamples) {
          clearInterval(intervalId)

          // Clean up resources
          source.disconnect()
          audioTrack.stop()
          audioContext.close()

          // Normalize values to 0-1 range
          const normalizedNoiseFloor = noiseFloor / 256
          const normalizedPeakLevel = peakLevel / 256

          resolve(
            <div>
              <h4 style={{ margin: '0 0 8px 0', color: '#4CAF50' }}>Audio Input Test Results</h4>
              <div style={{ marginBottom: '6px' }}>
                Audio input capture test completed successfully
              </div>
              <div>Devices detected: {audioInputDevices.length}</div>
              <div>Active device: {audioTrack.label}</div>
              <div>
                Noise floor: {Math.round(normalizedNoiseFloor * 100)}%
                {normalizedNoiseFloor > 0.1 && (
                  <span style={{ color: '#FF5252' }}> (High background noise detected)</span>
                )}
              </div>
              <div>
                Peak level: {Math.round(normalizedPeakLevel * 100)}%
                {normalizedPeakLevel < 0.3 && (
                  <span style={{ color: '#FFEB3B' }}> (Low signal level)</span>
                )}
              </div>
            </div>,
          )
        }
      }, 100)
    })
  } catch (error) {
    const isPermissionError = error instanceof DOMException && error.name === 'NotAllowedError'

    return (
      <div>
        <h4 style={{ margin: '0 0 8px 0', color: '#FF5252' }}>Audio Input Test Results</h4>
        <div style={{ marginBottom: '6px' }}>
          {isPermissionError
            ? 'Microphone access permission denied'
            : `Error testing audio input: ${error}`}
        </div>
        <div>Devices detected: 0</div>
      </div>
    )
  }
}

/**
 * Handles logging audio errors
 * @param error The caught error
 */
export function handleAudioError(error: unknown) {
  if (error instanceof DOMException) {
    switch (error.name) {
      case 'NotAllowedError':
        console.error('[AudioInput] Microphone access denied by user or system settings.')
        if (AudioInput.ENABLE_LOGGING) {
          console.log('[AudioInput] Troubleshooting tips:')
          console.log('  - Check that you have granted microphone permissions in browser settings')
          console.log('  - Ensure no other application is using the microphone exclusively')
          console.log('  - Try selecting a specific audio device if multiple are available')
        }
        break
      case 'NotFoundError':
        console.error('[AudioInput] No microphone detected on this device.')
        if (AudioInput.ENABLE_LOGGING) {
          console.log('[AudioInput] Troubleshooting tips:')
          console.log('  - Check if a microphone is properly connected')
          console.log('  - Try reconnecting your audio device')
        }
        break
      case 'NotReadableError':
        console.error('[AudioInput] Could not start audio capture. Hardware or OS error.')
        if (AudioInput.ENABLE_LOGGING) {
          console.log('[AudioInput] Troubleshooting tips:')
          console.log('  - Try reconnecting your audio device')
          console.log('  - Restart your browser or application')
          console.log('  - Check system audio settings')
        }
        break
      default:
        console.error(`[AudioInput] Error initializing audio: ${error.name}`, error)
    }
  } else {
    console.error('[AudioInput] Failed to initialize audio input:', error)
  }

  // Even when there's an error, log browser audio capabilities for debugging
  if (navigator.mediaDevices) {
    if (AudioInput.ENABLE_LOGGING) console.log('[AudioInput] Media devices API available')
  } else {
    console.error('[AudioInput] Media devices API not available - microphone access not possible')
  }

  if (typeof window.AudioContext !== 'undefined') {
    if (AudioInput.ENABLE_LOGGING) console.log('[AudioInput] AudioContext API available')
  } else {
    console.error('[AudioInput] AudioContext API not available - audio processing not possible')
  }
}
