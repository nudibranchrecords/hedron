import { useAppStore } from 'src/renderer/engine/sketchesState'

export const WorkArea = (): JSX.Element => {
  const sketchLibrary = useAppStore((state) => state.sketchLibrary)
  const sketches = useAppStore((state) => state.sketches)

  // TODO: Proper selectors/hooks to get this stuff
  const sketchLibraryVals = Object.values(sketchLibrary)
  const sketchesVals = Object.values(sketches)

  return (
    <div>
      <h2>Add Sketches</h2>
      <ul>
        {sketchLibraryVals.map(({ name }) => (
          <li key={name}>
            <button>{name}</button>
          </li>
        ))}
      </ul>
      <h2>Remove sketches</h2>
      <ul>
        {sketchesVals.map(({ sketchId }) => (
          <li key={sketchId}>
            <button>Remove {sketchId}</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
