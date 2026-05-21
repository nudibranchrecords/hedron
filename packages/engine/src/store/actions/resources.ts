import { EngineState } from '@store/types'

export const addResource = (
  state: EngineState,
  fileName: string,
  contentType: string,
  lastUpdated: number,
) => {
  state.resources[fileName] = {
    fileName,
    contentType,
    lastUpdated,
  }
}

export const removeResource = (state: EngineState, fileName: string) => {
  delete state.resources[fileName]
}
