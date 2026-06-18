import { EngineState } from '@store/types'

export const addResource = (
  state: EngineState,
  fileName: string,
  contentType: string,
  lastModified: number,
) => {
  state.resources[fileName] = {
    fileName,
    contentType,
    lastModified,
  }
}

export const removeResource = (state: EngineState, fileName: string) => {
  delete state.resources[fileName]
}
