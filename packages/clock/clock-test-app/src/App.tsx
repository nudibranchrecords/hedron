import { useEffect } from 'react'
// eslint-disable-next-line
import { Clock } from '../../src/Clock'
import './custom.css'

const clock = new Clock()

// arena height - pip height (see custom.css)
const H = 300 - 4

const $y = (id: string, y: number) =>
  (document.querySelector<HTMLDivElement>(`#${id}`)!.style.transform = `translateY(${y}px)`)

function App() {
  useEffect(() => {
    const update = () => {
      document.querySelector('#clockDigit')!.textContent = clock.delta.toString()

      $y('mod', clock.delta % H)
      $y('sin', Math.sin(clock.delta) * H * 0.5 + H * 0.5)
      $y('cos', Math.cos(clock.delta) * H * 0.5 + H * 0.5)

      requestAnimationFrame(update)
    }

    requestAnimationFrame(update)
  }, [])

  return (
    <>
      <section>
        <div className="grid">
          <code id="clockDigit">{clock.delta}</code>
          <button onClick={clock.start}>start</button>
          <button onClick={clock.stop}>Stop</button>
        </div>
      </section>
      <section>
        <div className="arena grid">
          <div id="mod" className="pip"></div>
          <div id="sin" className="pip"></div>
          <div id="cos" className="pip"></div>
        </div>
      </section>
    </>
  )
}

export default App
