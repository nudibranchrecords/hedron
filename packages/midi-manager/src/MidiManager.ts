import { Signal } from './Signal'

/**
 * Common MIDI message types as human readable names.
 */
export enum MidiMessageType {
  Clock = 'Clock',
  Start = 'Start',
  Continue = 'Continue',
  Stop = 'Stop',
  NoteOff = 'Note Off',
  NoteOn = 'Note On',
  PolyphonicKeyPressure = 'Polyphonic Key Pressure (Aftertouch)',
  ControlChange = 'Control Change',
  ProgramChange = 'Program Change',
  ChannelPressure = 'Channel Pressure (Aftertouch)',
  PitchBendChange = 'Pitch Bend Change',
  Unknown = 'Unknown',
}

export type MidiMessageTypeKey = keyof typeof MidiMessageType

/**
 * A simple type that provides both the device and the message of a MIDI event.
 */
export type MIDIEvent = {
  device: MIDIInput
  channel: number
  type: MidiMessageTypeKey
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
  public devices: MIDIInput[] = []

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
    this.devices.forEach((device) => {
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
      this.devices.length === deviceList.length &&
      this.devices.every((value, index) => value === deviceList[index])
    ) {
      return
    }
    this.clearMidiEventListeners()

    this.devices = deviceList

    // Add event listeners to new devices
    this.devices.forEach((device: MIDIInput) => {
      if (!this.eventListeners.has(device)) {
        const listener = (message: MIDIMessageEvent) => {
          if (!message.data) return
          const [status, note, value] = message.data
          const channel = status & 0x0f
          const type = this.getMidiMessageType(status)
          this.onMidiMessage.dispatch({ device, channel, type, note, value })
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
      console.log('MIDI learn canceled')
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
   * Converts a MIDI status byte to a human readable message type.
   * @param status The status byte of a MIDI message.
   * @returns The human readable message type via the MidiMessageType enum.
   */
  public getMidiMessageType(status: number): MidiMessageTypeKey {
    const messageType = status & 0xf0 // Mask the lower nibble to get the message type

    switch (messageType) {
      case 0xf0:
        switch (status) {
          case 0xf8:
            return 'Clock'
          case 0xfa:
            return 'Start'
          case 0xfb:
            return 'Continue'
          case 0xfc:
            return 'Stop'
          default:
            return 'Unknown'
        }
      case 0x80:
        return 'NoteOff'
      case 0x90:
        return 'NoteOn'
      case 0xa0:
        return 'PolyphonicKeyPressure'
      case 0xb0:
        return 'ControlChange'
      case 0xc0:
        return 'ProgramChange'
      case 0xd0:
        return 'ChannelPressure'
      case 0xe0:
        return 'PitchBendChange'
      default:
        return 'Unknown'
    }
  }
}
