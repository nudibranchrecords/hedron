import { useEffect } from 'react'
// eslint-disable-next-line
import { Clock } from '../../src/Clock'
import './custom.css'

const clock = new Clock()

// arena height - pip height (see custom.css)
const H = 300 - 4

const TAU = Math.PI * 2

const $y = (id: string, y: number) =>
  (document.querySelector<HTMLDivElement>(`#${id}`)!.style.transform = `translateY(${y}px)`)

function App() {
  useEffect(() => {
    const update = () => {
      const d = Math.round(clock.beatDelta * 1000) / 1000

      document.querySelector('#delta')!.textContent = d.toString()
      document.querySelector('#beat')!.textContent = clock.beatCount.toString()

      $y('saw', (d * H) % H)
      $y('sin', Math.sin(d * TAU) * H * 0.5 + H * 0.5)
      $y('sinBar', Math.sin((d * TAU) / 4) * H * 0.5 + H * 0.5)
      $y('square', Math.floor((d % 1) * 2) * H) // TODO: feels off...
      $y('triangle', Math.abs((d % 1) * 2 - 1) * H)

      requestAnimationFrame(update)
    }

    requestAnimationFrame(update)
  }, [])

  return (
    <>
      <section>
        <div className="grid">
          <code id="delta"></code>
          <button onClick={clock.start}>start</button>
          <button onClick={clock.stop}>stop</button>
          <button onClick={clock.reset}>reset</button>
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
      <div className="grid">
        <code id="beat"></code>
      </div>
    </>
  )
}

export default App
