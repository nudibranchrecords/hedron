import { FormEvent, useEffect, useRef } from 'react'
import { Clock } from '@hedron-gl/clock'
import './custom.css'
import { MidiClockListener } from './MidiClockListener'

const DEFAULT_BPM = 120

// arena height - pip height (see custom.css)
const H = 300 - 4

const TAU = Math.PI * 2

const $text = (id: string, text: string | number) => {
  document.querySelector<HTMLDivElement>(`#${id}`)!.textContent = text.toString()
}

const $y = (id: string, y: number) =>
  (document.querySelector<HTMLDivElement>(`#${id}`)!.style.transform = `translateY(${y}px)`)

let shouldCirclePulse = true

function App() {
  const clockRef = useRef<Clock>()

  useEffect(() => {
    clockRef.current = new Clock(DEFAULT_BPM)

    const unsubscribeBeats = clockRef.current.onNewBeat((beat) => {
      $text('beat', beat)
    })

    const unsubscribeBpm = clockRef.current.onBpmChange((bpm) => {
      $text('smoothedBpm', bpm)
    })

    let raf = 0

    const midiClockListener = new MidiClockListener({
      onPulse: clockRef.current.sendTimingPulse,
      onStart: clockRef.current.startOnNextTimingPulse,
      onStop: () => {
        clockRef.current!.stop()
      },
      onContinue: () => {
        clockRef.current!.continueOnNextTimingPulse()
      },
    })

    const update = () => {
      const d = Math.round(clockRef.current!.beatDelta * 1000) / 1000

      if (clockRef.current!.beatCount === 1 && shouldCirclePulse) {
        shouldCirclePulse = false
        const circle = document.querySelector<HTMLDivElement>('.circle')!

        circle.classList.add('white')
        requestAnimationFrame(() => {
          circle.classList.remove('white')
        })
      }
      if (clockRef.current!.beatCount === 2) {
        shouldCirclePulse = true
      }

      $text('delta', d)
      $text('bpm', Math.round(clockRef.current!.bpm * 100) / 100)
      $text('beatPulseOffset', Math.round(clockRef.current!.beatPulseOffset * 10000) / 10000)

      $y('saw', (d * H) % H)
      $y('sin', Math.sin(d * TAU) * H * 0.5 + H * 0.5)
      $y('sinBar', Math.sin((d * TAU) / 4) * H * 0.5 + H * 0.5)
      $y('square', Math.floor((d % 1) * 2) * H) // TODO: feels off...
      $y('triangle', Math.abs((d % 1) * 2 - 1) * H)

      raf = requestAnimationFrame(update)
    }

    raf = requestAnimationFrame(update)

    return () => {
      midiClockListener.clearMidiEventListeners()
      cancelAnimationFrame(raf)
      unsubscribeBeats()
      unsubscribeBpm()
    }
  }, [])

  const onBpmSubmit = (e: FormEvent) => {
    e.preventDefault()
    clockRef.current!.bpm = Number(document.querySelector<HTMLInputElement>('#bpmField')!.value)
  }

  const onStartClick = () => {
    clockRef.current?.start()
  }

  const onStopClick = () => {
    clockRef.current?.stop()
  }

  const onResetClick = () => {
    clockRef.current?.reset()
  }

  const onTempoTapClick = () => {
    clockRef.current?.sendTempoTap()
  }

  const onDeltaSliderChange = () => {
    clockRef.current!.beatDelta = Number(e.target.value)
  }

  return (
    <>
      <section>
        <div className="grid">
          <button onClick={onStartClick}>start</button>
          <button onClick={onStopClick}>stop</button>
          <button onClick={onResetClick}>reset</button>
          <button onClick={onTempoTapClick}>tap</button>
        </div>
      </section>
      <section>
        <div className="arena grid">
          <div id="saw" className="pip"></div>
          <div id="sin" className="pip"></div>
          <div id="sinBar" className="pip"></div>
          <div id="square" className="pip"></div>
          <div id="triangle" className="pip"></div>
        </div>
      </section>

      <section className="grid">
        <div>
          <div>Current Beat</div>
          <h3 id="beat"></h3>
        </div>
        <div>
          <div>Current BPM</div>
          <h3 id="smoothedBpm"></h3>
        </div>
        <div>
          <label>Set BPM</label>
          <form className="grid" onSubmit={onBpmSubmit}>
            <div>
              <input id="bpmField" type="number"></input>
            </div>
            <div>
              <button type="submit">submit</button>
            </div>
          </form>
        </div>
      </section>
      <section className="grid">
        <input type="range" min={0} max={64} step={0.001} onChange={onDeltaSliderChange}></input>
      </section>
      <section className="grid">
        <div className="circle"></div>
        <code>
          Delta: <span id="delta"></span>
          <br />
          BPM (unsmoothed): <span id="bpm"></span>
          <br />
          Pulse offset: <span id="beatPulseOffset"></span>
        </code>
      </section>
    </>
  )
}

export default App
