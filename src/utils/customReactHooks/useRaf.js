import { useEffect } from 'react'

const useRaf = (cb) => {
  useEffect(() => {
    let raf

    const loop = () => {
      cb()
      raf = requestAnimationFrame(loop)
    }

    loop()

    return () => {
      cancelAnimationFrame(raf)
    }
  }, [])
}

export default useRaf
