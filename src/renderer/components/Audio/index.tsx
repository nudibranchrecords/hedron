import { useCallback } from 'react'
import c from './styles.module.css'
import { AudioAnalyser } from 'src/renderer/audio/AudioAnalyser'
import { FreqPreview } from 'src/renderer/audio/FreqPreview'

export const Audio = (): JSX.Element => {
  const containerRef = useCallback(async (node: HTMLDivElement) => {
    if (node !== null) {
      const audio = new AudioAnalyser()
      const data = await audio.init()
      new FreqPreview(data, node)
    }
  }, [])

  return <div ref={containerRef} className={c.wrapper}></div>
}
