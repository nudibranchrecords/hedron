import { useEngineStore } from '@hedron/ui-core'
import { useShallow } from 'zustand/react/shallow'

export const useInput = (id: string) => {
  return useEngineStore((state) => state.inputs[id])
}

export const useInputsWithNode = (nodeId: string) => {
  return useEngineStore(
    useShallow((state) =>
      Object.values(state.inputs).filter((input) => input.targetNodeId === nodeId),
    ),
  )
}
