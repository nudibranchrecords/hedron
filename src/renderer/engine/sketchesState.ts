interface SketchState {
  id: string
  sketchId: string
}

const sketchesState: { [key: string]: SketchState } = {
  id_a: {
    id: 'id_a',
    sketchId: 'logo',
  },
  id_b: {
    id: 'id_b',
    sketchId: 'solid',
  },
  id_c: {
    id: 'id_c',
    sketchId: 'solid',
  },
}

export const getSketchesState = (): SketchState[] => {
  return Object.values(sketchesState)
}
