declare global {
  interface Window {
    HEDRON: {
      dependencies: {
        THREE: typeof import('three')
        THREE_EXTRAS: typeof import('three-stdlib')
        postprocessing: typeof import('postprocessing')
      }
    }
  }
}

// Ensure it's treated as a module by exporting an empty object.
export {}
