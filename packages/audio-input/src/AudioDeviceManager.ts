/**
 * Manages audio device discovery, selection and initialization
 */
export class AudioDeviceManager {
  /**
   * Controls whether audio-related console logging is enabled
   * Set to false to disable all audio debug logs
   */
  public static ENABLE_LOGGING = false

  /**
   * List of available audio input devices
   */
  public availableInputDevices: MediaDeviceInfo[] = []

  /**
   * Currently selected audio input device ID
   */
  public currentDeviceId: string = 'default'

  /**
   * Current audio stream
   */
  public currentStream: MediaStream | undefined

  /**
   * Constructor initializes the AudioDeviceManager
   */
  constructor() {
    if (AudioDeviceManager.ENABLE_LOGGING) {
      console.log('[AudioDeviceManager] Initializing...')
    }
  }

  /**
   * Updates the list of available audio input devices
   * @returns Promise with array of input devices
   */
  public async updateInputDeviceList(): Promise<MediaDeviceInfo[]> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      this.availableInputDevices = devices.filter((device) => device.kind === 'audioinput')

      if (AudioDeviceManager.ENABLE_LOGGING) {
        console.log('[AudioDeviceManager] Available audio input devices:')
        this.availableInputDevices.forEach((device, index) => {
          console.log(`  ${index + 1}. ${device.label || 'Unnamed device'} (${device.deviceId})`)
        })
      }

      if (this.availableInputDevices.length === 0) {
        console.warn('[AudioDeviceManager] No audio input devices detected!')
      }

      return this.availableInputDevices
    } catch (deviceError) {
      console.warn('[AudioDeviceManager] Could not enumerate audio devices:', deviceError)
      this.availableInputDevices = []
      return []
    }
  }

  /**
   * Gets audio stream from the selected device
   * @returns A Promise resolving to the media stream from the selected audio input device
   */
  public async getAudioStream(): Promise<MediaStream> {
    // Close existing stream if it exists
    this.closeCurrentStream()

    try {
      if (AudioDeviceManager.ENABLE_LOGGING) {
        console.log(
          `[AudioDeviceManager] Requesting microphone access for device: ${this.currentDeviceId}`,
        )
      }

      const constraints = {
        audio:
          this.currentDeviceId !== 'default' ? { deviceId: { exact: this.currentDeviceId } } : true,
      }

      this.currentStream = await navigator.mediaDevices.getUserMedia(constraints)

      // Log information about the audio tracks that were captured
      if (AudioDeviceManager.ENABLE_LOGGING) {
        const audioTracks = this.currentStream.getAudioTracks()
        console.log(
          `[AudioDeviceManager] Audio access granted. Captured ${audioTracks.length} audio track(s):`,
        )
        audioTracks.forEach((track, index) => {
          console.log(`  Track ${index + 1}: ${track.label}`)
          console.log(`    - Enabled: ${track.enabled}`)
          console.log(`    - Muted: ${track.muted}`)
          console.log(`    - ReadyState: ${track.readyState}`)

          // Log track constraints and settings
          const settings = track.getSettings()
          console.log('    - Settings:', settings)
        })
      }

      return this.currentStream
    } catch (error) {
      this.handleAudioAccessError(error)
      throw error
    }
  }

  /**
   * Changes the active audio input device
   * @param deviceId ID of the device to use, 'default' uses system default
   * @returns Promise resolving when the device is changed
   */
  public async changeAudioInputDevice(deviceId: string): Promise<boolean> {
    try {
      if (AudioDeviceManager.ENABLE_LOGGING) {
        console.log(`[AudioDeviceManager] Changing audio input device to: ${deviceId}`)
      }

      // Store the new device ID
      this.currentDeviceId = deviceId

      // Close existing stream - new stream will be created when needed
      this.closeCurrentStream()

      return true
    } catch (error) {
      console.error(`[AudioDeviceManager] Failed to change audio input device:`, error)
      return false
    }
  }

  /**
   * Close and cleanup the current audio stream
   */
  public closeCurrentStream(): void {
    if (this.currentStream) {
      this.currentStream.getTracks().forEach((track) => track.stop())
      this.currentStream = undefined
    }
  }

  /**
   * Handle errors that occur when trying to access audio devices
   * @param error The error that occurred
   */
  private handleAudioAccessError(error: unknown): void {
    // Always log errors regardless of logging settings
    if (error instanceof DOMException) {
      switch (error.name) {
        case 'NotAllowedError':
          console.error('[AudioDeviceManager] Microphone access denied by user or system settings.')
          if (AudioDeviceManager.ENABLE_LOGGING) {
            console.log('[AudioDeviceManager] Troubleshooting tips:')
            console.log(
              '  - Check that you have granted microphone permissions in browser settings',
            )
            console.log('  - Ensure no other application is using the microphone exclusively')
            console.log('  - Try selecting a specific audio device if multiple are available')
          }
          break
        case 'NotFoundError':
          console.error('[AudioDeviceManager] No microphone detected on this device.')
          if (AudioDeviceManager.ENABLE_LOGGING) {
            console.log('[AudioDeviceManager] Troubleshooting tips:')
            console.log('  - Check if a microphone is properly connected')
            console.log('  - Try reconnecting your audio device')
          }
          break
        case 'NotReadableError':
          console.error('[AudioDeviceManager] Could not start audio capture. Hardware or OS error.')
          if (AudioDeviceManager.ENABLE_LOGGING) {
            console.log('[AudioDeviceManager] Troubleshooting tips:')
            console.log('  - Try reconnecting your audio device')
            console.log('  - Restart your browser or application')
            console.log('  - Check system audio settings')
          }
          break
        default:
          console.error(`[AudioDeviceManager] Error initializing audio: ${error.name}`, error)
      }
    } else {
      console.error('[AudioDeviceManager] Failed to initialize audio input:', error)
    }

    // Even when there's an error, log browser audio capabilities for debugging
    if (navigator.mediaDevices) {
      if (AudioDeviceManager.ENABLE_LOGGING)
        console.log('[AudioDeviceManager] Media devices API available')
    } else {
      console.error(
        '[AudioDeviceManager] Media devices API not available - microphone access not possible',
      )
    }

    if (typeof window.AudioContext !== 'undefined') {
      if (AudioDeviceManager.ENABLE_LOGGING)
        console.log('[AudioDeviceManager] AudioContext API available')
    } else {
      console.error(
        '[AudioDeviceManager] AudioContext API not available - audio processing not possible',
      )
    }
  }
}
