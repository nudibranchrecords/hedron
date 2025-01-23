import { useEffect, useRef } from 'react'
// eslint-disable-next-line
import { Clock } from '../../src/Clock'

const clock = new Clock()

function App() {
  const deltaRef = useRef<HTMLElement>(null)
  useEffect(() => {
    const update = () => {
      deltaRef.current!.textContent = clock.delta.toString()
      requestAnimationFrame(update)
    }

    requestAnimationFrame(update)
  }, [])

  return (
    <section>
      <div className="grid">
        <code ref={deltaRef}>{clock.delta}</code>
        <button onClick={clock.start}>start</button>
        <button onClick={clock.stop}>Stop</button>
      </div>
    </section>
  )
}

export default App
