import { useMemo } from 'react'
import { useAppStore } from 'src/renderer/engine/sketchesState'

export const WorkArea = (): JSX.Element => {
  const sketchLibrary = useAppStore((state) => state.sketchLibrary)
  const sketches = useAppStore((state) => state.sketches)
  const addSketch = useAppStore((state) => state.addSketch)
  const deleteSketch = useAppStore((state) => state.deleteSketch)
  const setActiveSketchId = useAppStore((state) => state.setActiveSketchId)
  const activeSketchId = useAppStore((state) => state.activeSketchId)

  // TODO: Proper selectors/hooks to get this stuff
  const sketchLibraryVals = useMemo(() => Object.values(sketchLibrary), [sketchLibrary])
  const sketchesVals = useMemo(() => Object.values(sketches), [sketches])
  const activeSketch = activeSketchId && sketches[activeSketchId]

  return (
    <div>
      {activeSketch && (
        <>
          <h2>Sketch: {activeSketch.title}</h2>
        </>
      )}

      <h2>Select Sketch</h2>
      <ul>
        {sketchesVals.map(({ title, id }) => (
          <li key={id}>
            <button onClick={() => setActiveSketchId(id)}>
              {title} ({id})
            </button>
          </li>
        ))}
      </ul>

      <h2>Add Sketches</h2>
      <ul>
        {sketchLibraryVals.map(({ title, moduleId }) => (
          <li key={moduleId}>
            <button onClick={() => addSketch(moduleId)}>{title}</button>
          </li>
        ))}
      </ul>
      <h2>Remove sketches</h2>
      <ul>
        {sketchesVals.map(({ moduleId: sketchId, id }) => (
          <li key={id}>
            <button onClick={() => deleteSketch(id)}>
              Remove {sketchId} ({id})
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
