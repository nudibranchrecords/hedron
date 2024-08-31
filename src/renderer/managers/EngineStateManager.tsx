import { useEffect, useMemo } from 'react'
import { useAppStore } from 'src/renderer/engine/sketchesState'

import { addSketch } from '../engine/sketches'

const SketchManager = ({ id }: { id: string }): JSX.Element => {
  const sketches = useAppStore((state) => state.sketches)
  const { sketchId } = sketches[id]

  useEffect(() => {
    console.log(sketchId)
    addSketch(sketchId, id)

    return () => { }
  }, [])

  return <></>
}

export const EngineStateManager = (): JSX.Element => {
  const sketches = useAppStore((state) => state.sketches)

  // TODO: Proper selectors/hooks to get this stuff
  const sketchesVals = useMemo(() => Object.values(sketches), [sketches])
  return (
    <>
      {sketchesVals.map(({ id }) => (
        <SketchManager key={id} id={id} />
      ))}
    </>
  )
}
