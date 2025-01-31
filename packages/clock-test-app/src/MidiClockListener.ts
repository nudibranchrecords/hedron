export enum MidiMessageType {
  Clock = 'Clock',
  Start = 'Start',
  Continue = 'Continue',
  Stop = 'Stop',
  Unknown = 'Unknown',
}

export type MIDIEvent = {
  device: MIDIInput
  message: MIDIMessageEvent
}

export class MidiClockListener {
  private devices: MIDIInput[] = []
  private midiAccess: MIDIAccess | null = null
  private eventListeners: Map<MIDIInput, (event: MIDIMessageEvent) => void> = new Map()
  private onPulse: () => void = () => {}
  private onStart: () => void = () => {}
  private onStop: () => void = () => {}
  private devicesAssigned: Promise<void>
  private resolveDevicesAssigned: () => void = () => {}

  constructor({
    onPulse,
    onStart,
    onStop,
  }: {
    onPulse: () => void
    onStart: () => void
    onStop: () => void
  }) {
    this.devicesAssigned = new Promise((resolve) => {
      this.resolveDevicesAssigned = resolve
    })

    this.findMidiDevices()
    this.onPulse = onPulse
    this.onStart = onStart
    this.onStop = onStop
  }

  private setDevices = (deviceList: MIDIInput[]): void => {
    if (
      this.devices.length === deviceList.length &&
      this.devices.every((value, index) => value === deviceList[index])
    ) {
      return
    }

    this.devices = deviceList

    // Add event listeners to new devices
    this.devices.forEach((device: MIDIInput) => {
      const listener = (message: MIDIMessageEvent) => {
        if (!message.data) {
          console.error('No data in MIDI message:', message)
          return
        }

        const status = message.data[0]
        const messageType = this.getMidiMessageType(status)

        if (messageType === MidiMessageType.Clock) this.onPulse()
        if (messageType === MidiMessageType.Start) this.onStart()
        if (messageType === MidiMessageType.Stop) this.onStop()
      }

      device.addEventListener('midimessage', listener)

      this.eventListeners.set(device, listener)
    })

    this.resolveDevicesAssigned()
  }

  public clearMidiEventListeners = async (): Promise<void> => {
    await this.devicesAssigned

    this.devices.forEach((device) => {
      const listener = this.eventListeners.get(device)

      if (listener) {
        device.removeEventListener('midimessage', listener)
        this.eventListeners.delete(device)
      }
    })
  }

  private updateDevices = (): void => {
    this.setDevices(Array.from(this.midiAccess?.inputs.values() ?? []))
  }

  public findMidiDevices = async (): Promise<void> => {
    if (!navigator.requestMIDIAccess) {
      console.error('Web MIDI API is not supported in this browser.')
      return
    }

    try {
      this.midiAccess = await navigator.requestMIDIAccess()

      // this.midiAccess.addEventListener('statechange', this.updateDevices)
      this.updateDevices()
    } catch (error) {
      console.error('Failed to get MIDI access:', error)
    }
  }

  private getMidiMessageType(status: number): MidiMessageType {
    const messageType = status & 0xf0 // Mask the lower nibble to get the message type

    switch (messageType) {
      case 0xf0:
        switch (status) {
          case 0xf8:
            return MidiMessageType.Clock
          case 0xfa:
            return MidiMessageType.Start
          case 0xfb:
            return MidiMessageType.Continue
          case 0xfc:
            return MidiMessageType.Stop
          default:
            return MidiMessageType.Unknown
        }
      default:
        return MidiMessageType.Unknown
    }
  }
}
