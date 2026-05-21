import { EngineState } from '@store/types'

export const addResource = (state: EngineState, fileName: string, contentType: string) => {
  if (!state.resources[fileName]) {
    state.resources[fileName] = { fileName, contentType: contentType }
  }
}

export const removeResource = (state: EngineState, fileName: string) => {
  delete state.resources[fileName]
}
