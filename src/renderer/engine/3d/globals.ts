let sketchesServerUrl: string | undefined

export const setSketchesServerUrl = (url: string): void => {
  sketchesServerUrl = url
}

export const getSketchesServerUrl = (): string => {
  if (!sketchesServerUrl) throw new Error('No sketches server url')

  return sketchesServerUrl
}
