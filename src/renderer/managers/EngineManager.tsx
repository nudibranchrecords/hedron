import { useEffect, useMemo } from 'react'
import { useAppStore } from 'src/engine/store/useAppStore'

import { addSketch, removeSketch, sketchInstances } from '../../engine/3d/sketches'
import { useInterval } from 'usehooks-ts'

// Handles adding, removing and reimporting of sketch modules
const SketchManager = ({ id }: { id: string }): JSX.Element => {
  const sketches = useAppStore((state) => state.sketches)
  const { moduleId, paramIds } = sketches[id]
  const modules = useAppStore((state) => state.sketchModules)
  const libraryItem = modules[moduleId]

  useEffect(() => {
    addSketch(moduleId, id)

    return (): void => {
      removeSketch(id)
    }
    // libraryItem as a dep so sketch refreshes when module is updated
  }, [moduleId, id, libraryItem])

  // TODO: useAnimationFrame ??
  useInterval(() => {
    const nodesValues = useAppStore.getState().nodeValues
    const paramValues: { [key: string]: any } = {}

    paramIds.forEach((id, index) => {
      const value = nodesValues[id]

      const paramKey = libraryItem.config.params[index].key
      paramValues[paramKey] = value
    })

    sketchInstances[id].update({ deltaFrame: 1, params: paramValues })
  }, 16)

  return <></>
}

export const EngineManager = (): JSX.Element => {
  // TODO: Proper selectors/hooks to get this stuff
  const sketches = useAppStore((state) => state.sketches)
  const isReady = useAppStore((state) => state.isSketchModulesReady)
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
