declare global {
  interface Window {
    HEDRON: {
      dependencies: {
        THREE: typeof import('three')
        postprocessing: typeof import('postprocessing')
      }
    }
  }
}

// Ensure it's treated as a module by exporting an empty object.
export {}
