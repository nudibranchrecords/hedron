import { EngineStore } from '@store/engineStore'
import { NodeValue, SetterCreator } from '@store/types'

// Temporary buffer for node value updates per frame
const tempNodeValueBuffer: Record<string, NodeValue> = {}

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
export function flushNodeValueBuffer(setState: EngineStore['setState']) {
  setState(
    (state) => {
      for (const nodeId in tempNodeValueBuffer) {
        state.nodeValues[nodeId] = tempNodeValueBuffer[nodeId]
      }
    },
    undefined,
    'ignore/nodeValues',
  )
  // Clear buffer after flush
  for (const nodeId in tempNodeValueBuffer) {
    delete tempNodeValueBuffer[nodeId]
  }
}
