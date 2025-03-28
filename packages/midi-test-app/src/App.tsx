import './custom.css'
import { Midi, MIDIEvent, MidiMessageType } from '@hedron/midi'

const $text = (id: string, text: string) => {
  document.querySelector<HTMLDivElement>(`#${id}`)!.textContent = text
}

function App() {
  // const [mockBpm, setMockBpm] = useState(DEFAULT_BPM)

  const midiLogs: string[] = []

  function onMidiMessage(event: MIDIEvent) {
    const statusType = event.type
    if (statusType === MidiMessageType.Unknown) {
      return // my launch pad was sending unknown non-stop, would imagine some other devices do as well
    }
    midiLogs.unshift(
      `${event.device.name}: \t${statusType}(${statusType}): \t${event.channel} ${event.value}`,
    )
    if (midiLogs.length > 16) {
      midiLogs.pop()
    }
    $text('logs', midiLogs.join('\n'))
  }

  function onDeviceChange() {
    $text('devices', getMidiDevices())
  }

  const midi: Midi = new Midi()
  midi.onDeviceChange.add(onDeviceChange)
  midi.onMidiMessage.add(onMidiMessage)

  function getMidiDevices(): string {
    if (midi.devices.length === 0) {
      return 'No MIDI devices found.'
    }

    return midi.devices
      .map((device: MIDIInput) => {
        return `Connected MIDI device: ${device.name}`
      })
      .join('\n')
  }

  return (
    <>
      <section>
        <div className="grid">
          <div>
            <code>Midi Debug</code>
            <div className="pre-wrap" id="devices"></div>
            <code className="pre-wrap" id="logs"></code>
          </div>
        </div>
      </section>
    </>
  )
}

export default App
