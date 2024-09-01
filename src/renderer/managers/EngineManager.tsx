import { useEffect, useMemo } from 'react'
import { useAppStore } from 'src/renderer/engine/sketchesState'

import { addSketch, removeSketch } from '../engine/sketches'

const SketchManager = ({ id }: { id: string }): JSX.Element => {
  const sketches = useAppStore((state) => state.sketches)
  const { sketchId } = sketches[id]
  const sketchLibrary = useAppStore((state) => state.sketchLibrary)
  const libraryItem = sketchLibrary[sketchId]

  useEffect(() => {
    addSketch(sketchId, id)

    return (): void => {
      removeSketch(id)
    }
  }, [sketchId, id, libraryItem])

  return <></>
}

export const EngineManager = (): JSX.Element => {
  // TODO: Proper selectors/hooks to get this stuff
  const sketches = useAppStore((state) => state.sketches)
  const isReady = useAppStore((state) => state.isSketchLibraryReady)
  const sketchesVals = useMemo(() => Object.values(sketches), [sketches])

  return isReady ? (
    <>
      {sketchesVals.map(({ id }) => (
        <SketchManager key={id} id={id} />
      ))}
    </>
  ) : (
    <></>
  )
}
