import { useShallow } from 'zustand/react/shallow'
import { useEngineStore } from '@renderer/engine'

export const useInput = (id: string) => {
  return useEngineStore((state) => state.inputs[id])
}

export const useInputsWithNode = (nodeId: string) => {
  return useEngineStore(
    useShallow((state) =>
      Object.values(state.inputs).filter((input) => input.targetNodeIds.includes(nodeId)),
    ),
  )
}
