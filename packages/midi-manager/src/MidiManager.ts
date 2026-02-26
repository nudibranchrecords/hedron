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

/**
 * A class that handles MIDI input devices and messages.
 */
export class MidiManager {
  public readonly name: string = 'MIDI'
  public readonly description: string = 'Handles MIDI input devices and messages.'

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

  constructor() {
    this.findMidiDevices()
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
  public findMidiDevices = async (): Promise<void> => {
    if (!navigator.requestMIDIAccess) {
      console.error('Web MIDI API is not supported in this browser.')
      return
    }

    try {
      this.midiAccess = await navigator.requestMIDIAccess()
      this.midiAccess.addEventListener('statechange', this.updateDevices)
      this.updateDevices()
    } catch (error) {
      console.error('Failed to get MIDI access:', error)
    }
  }

  private learnPromise: Promise<MIDIEvent | null> | undefined
  private learnResolve: ((event: MIDIEvent | null) => void) | undefined
  private learnListener: ((event: MIDIEvent) => void) | undefined

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
    return this.learnPromise
  }

  /**
   * Cancels the current MIDI learn process.
   */
  public cancelMidiLearn(): void {
    if (this.learnListener) this.onMidiMessage.remove(this.learnListener)
    this.learnResolve?.(null)
    this.learnPromise = undefined
    this.learnResolve = undefined
    this.learnListener = undefined
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

  public sendMidiMessageRaw(device: MIDIOutput, data: number[], targetTime?: number): void {
    device.send(data, targetTime ?? performance.now())
  }

  public sendMidiMessage(device: MIDIOutput, event: MIDIEvent): void {
    // Construct the status byte with channel
    const status = event.type | (event.channel & 0x0f)
    const data1 = event.note
    const data2 = event.value ?? 0

    const message = new Uint8Array([status, data1, data2])
    device.send(message)
  }

  public async sendMidiNoteOn(device: MIDIOutput, note: number, velocity: number): Promise<void> {
    this.sendMidiMessage(device, {
      channel: 0,
      device,
      type: MidiMessageType.NoteOn,
      note,
      value: velocity,
    })
  }

  public async sendMidiNoteOff(device: MIDIOutput, note: number, velocity: number): Promise<void> {
    this.sendMidiMessage(device, {
      channel: 0,
      device,
      type: MidiMessageType.NoteOff,
      note,
      value: velocity,
    })
  }

  public async sendMidiNoteOnOff(
    device: MIDIOutput,
    note: number,
    velocity: number,
    duration: number,
    channel: number = 0,
  ): Promise<void> {
    this.sendMidiMessage(device, {
      channel,
      device,
      type: MidiMessageType.NoteOn,
      note,
      value: velocity,
    })

    setTimeout(() => {
      this.sendMidiMessage(device, {
        device,
        channel,
        type: MidiMessageType.NoteOff,
        note,
        value: velocity,
      })
    }, duration)
  }

  /**
   * Sends a timestamped MIDI note to the given output, for precise timing.
   * @param output The MIDI output to send the note to.
   * @param note The MIDI note number.
   * @param velocity The velocity of the note.
   * @param duration The duration to hold the note before sending a Note Off message.
   * @param targetTime The target time in milliseconds to send the note.
   */
  public sendMidiNoteAtMS(
    output: MIDIOutput,
    channel: number,
    note: number,
    velocity: number,
    duration: number,
    targetTime: number,
  ): void {
    output.send([MidiMessageType.NoteOn | (channel & 0x0f), note, velocity], targetTime)
    output.send([MidiMessageType.NoteOff | (channel & 0x0f), note, velocity], targetTime + duration)
  }
}
