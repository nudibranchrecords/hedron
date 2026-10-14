import { Signal } from './Signal'

/**
 * Midi message types, values based on status byte
 */
export enum MidiMessageType {
  // Entire status byte for clock messages (has no channel)
  Clock = 0xf8,
  Start = 0xfa,
  Continue = 0xfb,
  Stop = 0xfc,
  ActiveSensing = 0xfe,
  // Status byte for messages with channel, with channel nibble masked out
  NoteOff = 0x80,
  NoteOn = 0x90,
  PolyphonicKeyPressure = 0xa0,
  ControlChange = 0xb0,
  ProgramChange = 0xc0,
  ChannelPressure = 0xd0,
  PitchBendChange = 0xe0,
}

export const midiMessageNames: Record<MidiMessageType, string> = {
  [MidiMessageType.Clock]: 'Clock',
  [MidiMessageType.Start]: 'Start',
  [MidiMessageType.Continue]: 'Continue',
  [MidiMessageType.Stop]: 'Stop',
  [MidiMessageType.ActiveSensing]: 'Active Sensing',
  [MidiMessageType.NoteOff]: 'Note Off',
  [MidiMessageType.NoteOn]: 'Note On',
  [MidiMessageType.PolyphonicKeyPressure]: 'Polyphonic Key Pressure (Aftertouch)',
  [MidiMessageType.ControlChange]: 'Control Change',
  [MidiMessageType.ProgramChange]: 'Program Change',
  [MidiMessageType.ChannelPressure]: 'Channel Pressure (Aftertouch)',
  [MidiMessageType.PitchBendChange]: 'Pitch Bend Change',
}

/**
 * A simple type that provides both the device and the message of a MIDI event.
 */
export type MIDIEvent = {
  device: MIDIInput | MIDIOutput
  channel: number
  type: MidiMessageType
  note: number
  value?: number
}

type SmoothingEntry = {
  target: number
  current: number
  callback: (value: number) => void
}

/**
 * Threshold for stopping smoothing when close enough to target
 */
const SMOOTHING_THRESHOLD = 0.001

/**
 * A class that handles MIDI input devices and messages.
 */
export class MidiManager {
  public readonly name: string = 'MIDI'
  public readonly description: string = 'Handles MIDI input devices and messages.'

  /**
   * Smoothing factor for MIDI values (0 = no smoothing, closer to 1 = more smoothing)
   */
  public smoothing = 0.9

  /**
   * The list of MIDI input devices connected to the system.
   */
  public inputDevices: MIDIInput[] = []

  /**
   * The list of MIDI output devices connected to the system.
   */
  public outputDevices: MIDIOutput[] = []

  /**
   * The MIDI access object that allows for interaction with MIDI devices.
   */
  private midiAccess: MIDIAccess | null = null

  /**
   * A map of MIDI input devices to their event listeners.
   */
  private eventListeners: Map<MIDIInput, (event: MIDIMessageEvent) => void> = new Map()

  /**
   * A callback that is called when the list of MIDI devices changes.
   */
  public onDeviceChange: Signal<void> = new Signal<void>()

  /**
   * A callback that is called when a MIDI message is received.
   */
  public onMidiMessage: Signal<MIDIEvent> = new Signal<MIDIEvent>()
  /**
   * Map of smoothed values being tracked
   */
  private smoothedValues: Map<string, SmoothingEntry> = new Map()

  /**
   * Create a new MidiManager and begin searching for MIDI devices.
   */
  constructor() {
    this.findMidiDevices()
    this.startUpdateLoop()
  }

  /**
   * Clears all MIDI event listeners from the devices.
   */
  private clearMidiEventListeners = (): void => {
    this.inputDevices.forEach((device) => {
      const listener = this.eventListeners.get(device)
      if (listener) {
        device.removeEventListener('midimessage', listener)
        this.eventListeners.delete(device)
      }
    })
  }

  /**
   * Sets the list of MIDI devices connected to the system and adds event listeners to them.
   * @param deviceList The list of MIDI devices to set.
   */
  private setDevices = (deviceList: MIDIInput[]): void => {
    if (
      this.inputDevices.length === deviceList.length &&
      this.inputDevices.every((value, index) => value === deviceList[index])
    ) {
      return
    }
    this.clearMidiEventListeners()

    this.inputDevices = deviceList

    // Add event listeners to new devices
    this.inputDevices.forEach((device: MIDIInput) => {
      if (!this.eventListeners.has(device)) {
        const listener = (message: MIDIMessageEvent) => {
          if (!message.data) return
          const [status, note, value] = message.data
          const channel = status & 0x0f
          const type = this.getMidiMessageType(status)
          this.onMidiMessage.dispatch({
            device,
            channel,
            type,
            note,
            value,
          })
        }
        device.addEventListener('midimessage', listener)
        this.eventListeners.set(device, listener)
      }
    })

    this.onDeviceChange.dispatch()
  }

  /**
   * Updates the list of MIDI devices connected to the system.
   */
  private updateDevices = (): void => {
    this.setDevices(Array.from(this.midiAccess?.inputs.values() ?? []))
    this.outputDevices = Array.from(this.midiAccess?.outputs.values() ?? [])
  }

  /**
   * Finds all MIDI devices connected to the system, and sets up events listeners for both the devices and the midi access (add/remove).
   * @returns A promise that resolves when the MIDI devices have been found.
   */
  public async findMidiDevices(): Promise<void> {
    if (!navigator.requestMIDIAccess) {
      console.error('Web MIDI API is not supported in this browser.')
      return
    }

    try {
      this.midiAccess = await navigator.requestMIDIAccess({ sysex: true })
      this.midiAccess.addEventListener('statechange', this.updateDevices)
      this.updateDevices()
    } catch (error) {
      console.error('Failed to get MIDI access:', error)
    }
  }

  private learnPromise: Promise<MIDIEvent | null> | undefined
  private learnResolve: ((event: MIDIEvent | null) => void) | undefined
  private learnListener: ((event: MIDIEvent) => void) | undefined

  // Fires when a learn session starts or stops.
  public readonly onLearnStateChange = new Signal<boolean>()

  public get isLearning(): boolean {
    return !!this.learnPromise
  }

  /**
   * Start a MIDI learn process and return the learned MIDI event, or undefined if canceled.
   * @returns A promise that resolves with the learned MIDIEvent, or undefined if learning was canceled.
   */
  public async midiLearn(): Promise<MIDIEvent | undefined> {
    const event = await this.beginMidiLearn()
    if (!event) {
      console.log('MIDI learn canceled.')
      return
    }
    return event
  }

  /**
   * A function that will wait for and return the next midi message received, or null if the learn is canceled.
   * @returns A promise that resolves with the next MIDI message received.
   */
  public async beginMidiLearn(): Promise<MIDIEvent | null> {
    if (this.learnPromise) {
      this.cancelMidiLearn()
    }
    this.learnPromise = new Promise((resolve) => {
      this.learnResolve = resolve
      this.learnListener = (event: MIDIEvent) => {
        if (event.type === MidiMessageType.Clock || event.type === MidiMessageType.ActiveSensing)
          return
        resolve(event)
        this.learnResolve = undefined
        this.cancelMidiLearn()
      }
      this.onMidiMessage.add(this.learnListener)
    })
    this.onLearnStateChange.dispatch(true)
    return this.learnPromise
  }

  /**
   * Cancels the current MIDI learn process.
   */
  public cancelMidiLearn(): void {
    if (!this.learnPromise) return
    if (this.learnListener) this.onMidiMessage.remove(this.learnListener)
    this.learnResolve?.(null)
    this.learnPromise = undefined
    this.learnResolve = undefined
    this.learnListener = undefined
    this.onLearnStateChange.dispatch(false)
  }

  /**
   * Converts a MIDI status byte to our defined enum format.
   * @param status The status byte of a MIDI message.
   * @returns The status byte unnafected, or masked
   */
  public getMidiMessageType(status: number): MidiMessageType {
    const messageType = status & 0xf0 // Mask the lower nibble to get the message type

    if (messageType === 0xf0) {
      // Return entire status byte for clock
      return status
    }

    return messageType
  }

  /**
   * Sets a value to be smoothed over time
   * @param key Unique identifier for this smoothed value
   * @param current The current value to start smoothing from
   * @param target The target value to smooth towards
   * @param callback Function to call with the smoothed value
   */
  public setSmoothedValue(
    key: string,
    current: number,
    target: number,
    callback: (value: number) => void,
  ): void {
    this.smoothedValues.set(key, {
      current,
      target,
      callback,
    })
  }

  /**
   * Starts the update loop for smoothing values
   */
  private startUpdateLoop(): void {
    const update = () => {
      this.updateSmoothedValues()
      requestAnimationFrame(update)
    }
    requestAnimationFrame(update)
  }

  /**
   * Updates all smoothed values, lerping towards their targets
   */
  private updateSmoothedValues(): void {
    const toRemove: string[] = []

    this.smoothedValues.forEach((entry, key) => {
      const { target, current, callback } = entry
      const delta = target - current

      // Check if we're close enough to stop smoothing
      if (Math.abs(delta) < SMOOTHING_THRESHOLD) {
        // Set final value and mark for removal
        callback(target)
        toRemove.push(key)
      } else {
        // Lerp towards target
        const newValue = current * this.smoothing + target * (1 - this.smoothing)
        entry.current = newValue
        callback(newValue)
      }
    })

    // Remove entries that have reached their target
    toRemove.forEach((key) => this.smoothedValues.delete(key))
  }

  /**
   * Send raw MIDI data bytes to the given MIDIOutput, optionally scheduling them for a future time.
   * @param device The MIDI output device to send data to.
   * @param data The raw MIDI data bytes to send.
   * @param targetTime Optional target time in milliseconds to schedule the message.
   */
  public sendMidiMessageRaw(device: MIDIOutput, data: number[], targetTime?: number): void {
    if (targetTime === undefined) {
      device.send(data)
    } else {
      device.send(data, targetTime)
    }
  }

  /**
   * Send a MIDIEvent to the specified MIDIOutput, constructing the appropriate status and data bytes.
   * Handles message length differences (e.g., Program Change uses one data byte).
   * @param device The MIDI output device to send the event to.
   * @param event The MIDIEvent to send (contains channel, type, note, and optional value).
   * @param targetTime Optional target time in milliseconds to schedule the message.
   */
  public sendMidiMessage(device: MIDIOutput, event: MIDIEvent, targetTime?: number): void {
    // Construct the status byte with channel
    const status = event.type | (event.channel & 0x0f)
    const data1 = event.note
    const data2 = event.value ?? 0

    let message: Uint8Array

    // Some MIDI message types (e.g., Program Change, Channel Pressure) only use
    // one data byte and should therefore be sent as 2-byte messages.
    switch (event.type & 0xf0) {
      case MidiMessageType.ProgramChange:
      case MidiMessageType.ChannelPressure:
        message = new Uint8Array([status, data1])
        break
      default:
        message = new Uint8Array([status, data1, data2])
        break
    }
    if (targetTime === undefined) {
      device.send(message)
    } else {
      device.send(message, targetTime)
    }
  }

  /**
   * Send a Note On message (channel 0) to the specified MIDI output.
   * @param device The MIDI output device to send the note to.
   * @param note The MIDI note number (0-127).
   * @param velocity The velocity of the note (0-127).
   * @param channel MIDI channel to use (0-15). Defaults to 0.
   */
  public sendMidiNoteOn(
    device: MIDIOutput,
    note: number,
    velocity: number,
    channel: number = 0,
  ): void {
    this.sendMidiMessage(device, {
      channel,
      device,
      type: MidiMessageType.NoteOn,
      note,
      value: velocity,
    })
  }

  /**
   * Send a Note Off message (channel 0) to the specified MIDI output.
   * @param device The MIDI output device to send the note off to.
   * @param note The MIDI note number (0-127).
   * @param velocity The release velocity of the note (0-127).
   * @param channel MIDI channel to use (0-15). Defaults to 0.
   */
  public sendMidiNoteOff(
    device: MIDIOutput,
    note: number,
    velocity: number,
    channel: number = 0,
  ): void {
    this.sendMidiMessage(device, {
      channel,
      device,
      type: MidiMessageType.NoteOff,
      note,
      value: velocity,
    })
  }

  /**
   * Send a Note On followed by a Note Off after the specified duration.
   * @param device The MIDI output device to send messages to.
   * @param note The MIDI note number (0-127).
   * @param velocity The velocity for both Note On and Note Off (0-127).
   * @param duration Duration in milliseconds before sending the Note Off.
   * @param channel MIDI channel to use (0-15). Defaults to 0.
   * @param targetTime Optional target time (DOMHighResTimeStamp) to schedule the Note On.
   */
  public sendMidiNoteOnOff(
    device: MIDIOutput,
    note: number,
    velocity: number,
    duration: number,
    channel: number = 0,
    targetTime?: number,
  ): void {
    const sendTime = targetTime ?? performance.now()
    this.sendMidiMessage(
      device,
      {
        channel,
        device,
        type: MidiMessageType.NoteOn,
        note,
        value: velocity,
      },
      sendTime,
    )
    this.sendMidiMessage(
      device,
      {
        device,
        channel,
        type: MidiMessageType.NoteOff,
        note,
        value: velocity,
      },
      sendTime + duration,
    )
  }
}
