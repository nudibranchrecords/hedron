import { useShallow } from 'zustand/react/shallow'
import { Icon, MiniTabs, MiniTabsItem } from '@hedron/ui-core'
import { useCallback, useState } from 'react'
import { useSelectedParam } from '@components/hooks/useSelectedParam'
import { useEngineStore } from '@renderer/engine'

const useInputsWithNode = (nodeId: string) => {
  return useEngineStore(
    useShallow((state) =>
      Object.values(state.inputs).filter((input) => input.targetNodeIds.includes(nodeId)),
    ),
  )
}

export const SelectedParam = () => {
  const selectedParam = useSelectedParam()
  const addInput = useEngineStore((state) => state.addInput)
  // TODO: This should be moved into global state, so we can save the selected input
  const [selectedInputId, setSelectedInputId] = useState<string | null>(null)

  if (!selectedParam) {
    throw new Error(
      'SelectedParam component: selected param note found. This component should only be used when a param is selected',
    )
  }

  // TODO: This should open up a context menu where different types of inputs can be selected
  const onAddClick = useCallback(() => {
    const input = {
      type: 'midi',
      targetNodeIds: [selectedParam.id],
    }

    addInput(input)
  }, [addInput, selectedParam.id])

  const inputs = useInputsWithNode(selectedParam.id)

  return (
    <>
      <MiniTabs>
        {inputs.map((input) => (
          <MiniTabsItem
            key={input.id}
            isActive={selectedInputId === input.id}
            onClick={() => setSelectedInputId(input.id)}
          >
            {input.id}
          </MiniTabsItem>
        ))}
        <MiniTabsItem>
          <Icon name="add" onClick={onAddClick} />
        </MiniTabsItem>
      </MiniTabs>
      <div></div>
    </>
  )
}
