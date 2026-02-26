import { SetterCreator } from '@store/types'

// Temporary buffer for node value updates per frame
const tempNodeValueBuffer: Record<string, unknown> = {}

export const createUpdateNodeValue: SetterCreator<'updateNodeValue'> = () => (nodeId, value) => {
  tempNodeValueBuffer[nodeId] = value
}

export const createUpdateMultipleNodeValues: SetterCreator<'updateMultipleNodeValues'> =
  () => (nodeIds, values) => {
    for (let i = 0; i < nodeIds.length; i++) {
      tempNodeValueBuffer[nodeIds[i]] = values[i]
    }
  }

// Called once per frame in the engine update loop to flush buffered node values
export function flushNodeValueBuffer(
  setState: (fn: (state: { nodeValues: Record<string, unknown> }) => void) => void,
) {
  setState((state) => {
    for (const nodeId in tempNodeValueBuffer) {
      state.nodeValues[nodeId] = tempNodeValueBuffer[nodeId]
    }
  })
  // Clear buffer after flush
  for (const nodeId in tempNodeValueBuffer) {
    delete tempNodeValueBuffer[nodeId]
  }
}
