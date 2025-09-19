/**
 * Audio Test Utilities
 * Helper functions for debugging and testing audio functionality
 */
import { createAudioContext } from './AudioUtils'

/**
 * Generates diagnostic information about the audio system
 * @returns A string with formatted diagnostic information
 */
export async function getAudioDiagnostics(): Promise<string> {
  let report = '=== AUDIO SYSTEM DIAGNOSTICS ===\n\n'

  // Check if Web Audio API is available
  report += '🔍 Web Audio API Support:\n'
  if (
    typeof window.AudioContext !== 'undefined' ||
    typeof (window as any).webkitAudioContext !== 'undefined'
  ) {
    report += '✅ Web Audio API is supported\n'
  } else {
    report += '❌ Web Audio API is NOT supported\n'
  }

  // Check if MediaDevices API is available
  report += '\n🔍 MediaDevices API Support:\n'
  if (navigator.mediaDevices) {
    report += '✅ MediaDevices API is supported\n'

    // Try to list available audio devices
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const audioInputDevices = devices.filter((device) => device.kind === 'audioinput')
      report += `✅ Found ${audioInputDevices.length} audio input device(s)\n`

      if (audioInputDevices.length > 0) {
        report += '\n📱 Audio Input Devices:\n'
        audioInputDevices.forEach((device, index) => {
          report += `  ${index + 1}. ${device.label || 'Unnamed device'}\n`
        })
      } else {
        report += '❌ No audio input devices detected\n'
      }
    } catch (err) {
      report += `❌ Error enumerating devices: ${err}\n`
    }
  } else {
    report += '❌ MediaDevices API is NOT supported\n'
  }

  // Check user media permissions
  report += '\n🔍 Microphone Permission:\n'
  try {
    report += '⏳ Requesting microphone permission...\n'

    // Try to get permission with minimal access
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
      },
    })

    // Get track information
    const tracks = stream.getAudioTracks()
    report += `✅ Permission granted! Captured ${tracks.length} audio track(s)\n`

    if (tracks.length > 0) {
      const track = tracks[0]
      const settings = track.getSettings()

      report += '\n🎤 Audio Track Details:\n'
      report += `  - Label: ${track.label}\n`
      report += `  - Sample Rate: ${settings.sampleRate || 'unknown'}Hz\n`
      report += `  - Echo Cancellation: ${settings.echoCancellation ? 'enabled' : 'disabled'}\n`
      report += `  - Noise Suppression: ${settings.noiseSuppression ? 'enabled' : 'disabled'}\n`
      report += `  - Auto Gain Control: ${settings.autoGainControl ? 'enabled' : 'disabled'}\n`
    }

    // Test if we can create analyzer
    const audioContext = createAudioContext()
    const analyser = audioContext.createAnalyser()
    const source = audioContext.createMediaStreamSource(stream)
    source.connect(analyser)

    report += '\n🔊 Analyzer Created:\n'
    report += `  - FFT Size: ${analyser.fftSize}\n`
    report += `  - Frequency Bins: ${analyser.frequencyBinCount}\n`
    report += `  - Sample Rate: ${audioContext.sampleRate}Hz\n`

    // Create buffer to test analysis
    const buffer = new Uint8Array(analyser.frequencyBinCount)
    analyser.getByteFrequencyData(buffer)

    // Close the audio context and stop tracks to clean up resources
    source.disconnect()
    audioContext.close()
    tracks.forEach((track) => track.stop())

    report += '✅ Analyzer test successful\n'
  } catch (err) {
    if (err instanceof DOMException) {
      if (err.name === 'NotAllowedError') {
        report += '❌ Microphone permission was denied by the user or system\n'
      } else if (err.name === 'NotFoundError') {
        report += '❌ No microphone device found\n'
      } else {
        report += `❌ Error accessing microphone: ${err.name} - ${err.message}\n`
      }
    } else {
      report += `❌ Unexpected error: ${err}\n`
    }
  }

  // Check browser information
  const ua = navigator.userAgent
  report += '\n🔍 Browser Information:\n'
  report += `  - User Agent: ${ua}\n`

  // Check for mobile devices
  const isMobile = /iPhone|iPad|iPod|Android/i.test(ua)
  if (isMobile) {
    report += '  - Device Type: Mobile (may have more restricted audio access)\n'
  } else {
    report += '  - Device Type: Desktop\n'
  }

  report += '\n=== END OF DIAGNOSTICS ===\n'
  return report
}

// Test tone functionality has been moved to AudioUtils.ts

/**
 * Tests the audio input capture system and returns diagnostic information
 * @returns Promise with audio input metrics
 */
export async function testAudioInputCapture(): Promise<{
  success: boolean
  message: string
  metrics?: {
    deviceCount: number
    deviceLabel?: string
    noiseFloor?: number
    peakLevel?: number
  }
}> {
  try {
    // First check if media devices API is available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return {
        success: false,
        message: 'MediaDevices API not available in this browser',
      }
    }

    // List available devices
    const devices = await navigator.mediaDevices.enumerateDevices()
    const audioInputDevices = devices.filter((device) => device.kind === 'audioinput')

    if (audioInputDevices.length === 0) {
      return {
        success: false,
        message: 'No audio input devices detected',
        metrics: {
          deviceCount: 0,
        },
      }
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
        let sum = 0
        let peak = 0

        for (let i = 0; i < bufferLength; i++) {
          const value = dataArray[i]
          sum += value
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

          resolve({
            success: true,
            message: 'Audio input capture test completed successfully',
            metrics: {
              deviceCount: audioInputDevices.length,
              deviceLabel: audioTrack.label,
              noiseFloor: normalizedNoiseFloor,
              peakLevel: normalizedPeakLevel,
            },
          })
        }
      }, 100)
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'NotAllowedError') {
      return {
        success: false,
        message: 'Microphone access permission denied',
        metrics: {
          deviceCount: 0,
        },
      }
    }

    return {
      success: false,
      message: `Error testing audio input: ${error}`,
      metrics: {
        deviceCount: 0,
      },
    }
  }
}
