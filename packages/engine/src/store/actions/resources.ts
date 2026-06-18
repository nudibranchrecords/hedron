import { EngineState } from '@store/types'

export const addResource = (
  state: EngineState,
  fileName: string,
  contentType: string,
  lastModified: number,
) => {
  state.resources[fileName] = {
    fileName,
    filePath: `${fileName}?${lastModified}`, // append lastModified for cache busting
    contentType,
    lastModified,
  }
}

export const removeResource = (state: EngineState, fileName: string) => {
  delete state.resources[fileName]
}
