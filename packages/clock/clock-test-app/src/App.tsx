import { FormEvent, useEffect } from 'react'
// eslint-disable-next-line
import { Clock } from '../../src/Clock'
import './custom.css'

const clock = new Clock()

// arena height - pip height (see custom.css)
const H = 300 - 4

const TAU = Math.PI * 2

const $text = (id: string, text: string | number) => {
  document.querySelector<HTMLDivElement>(`#${id}`)!.textContent = text.toString()
}

const $y = (id: string, y: number) =>
  (document.querySelector<HTMLDivElement>(`#${id}`)!.style.transform = `translateY(${y}px)`)

function App() {
  useEffect(() => {
    const update = () => {
      const d = Math.round(clock.beatDelta * 1000) / 1000

      $text('delta', d)
      $text('bpm', clock.bpm)
      $text('beat', clock.beatCount)

      $y('saw', (d * H) % H)
      $y('sin', Math.sin(d * TAU) * H * 0.5 + H * 0.5)
      $y('sinBar', Math.sin((d * TAU) / 4) * H * 0.5 + H * 0.5)
      $y('square', Math.floor((d % 1) * 2) * H) // TODO: feels off...
      $y('triangle', Math.abs((d % 1) * 2 - 1) * H)

      requestAnimationFrame(update)
    }

    requestAnimationFrame(update)
  }, [])

  const onBpmSubmit = (e: FormEvent) => {
    e.preventDefault()
    clock.bpm = Number(document.querySelector<HTMLInputElement>('#bpmField')!.value)
  }

  return (
    <>
      <section>
        <div className="grid">
          <button onClick={clock.start}>start</button>
          <button onClick={clock.stop}>stop</button>
          <button onClick={clock.reset}>reset</button>
          <div>
            <code>
              Delta: <span id="delta"></span>
            </code>
          </div>
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
          <h3 id="bpm"></h3>
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
    </>
  )
}

export default App
