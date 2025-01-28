import { useEngineStore } from '@renderer/engine'

export const useInput = (id: string) => {
  const inputs = useEngineStore((state) => state.inputs)
  return inputs[id]
}

export const useInputsWithNode = (nodeId: string) => {
  const inputs = useEngineStore((state) => state.inputs)
  return Object.values(inputs).filter((input) => input.targetNodeIds.includes(nodeId))
}
