import { useShallow } from 'zustand/react/shallow'
import { Icon, MiniTabs, MiniTabsItem } from '@hedron/ui-core'
import { useCallback, useState } from 'react'
import { useSelectedParam } from '@components/hooks/useSelectedParam'
import { pluginViews, useEngineStore, engine } from '@renderer/engine'
import { useAppStore } from '@renderer/appStore'

// TODO: Just select for input id and name, for performance reasons
const useInputsWithNode = (nodeId: string) => {
  return useEngineStore(
    useShallow((state) =>
      Object.values(state.inputs).filter((input) => input.targetNodeIds.includes(nodeId)),
    ),
  )
}

export const SelectedParam = () => {
  const selectedParam = useSelectedParam()

  if (!selectedParam) {
    throw new Error(
      'SelectedParam component: selected param not found. This component should only be used when a param is selected',
    )
  }

  const addInput = useEngineStore((state) => state.addInput)

  const selectedInputId = useAppStore((state) => state.selectedInputs[selectedParam.id])
  const setSelectedInputId = useAppStore((state) => state.setSelectedInput)

  const currentInput = useEngineStore((state) =>
    selectedInputId ? state.inputs[selectedInputId] : null,
  )

  // TODO: This should open up a context menu where different types of inputs can be selected
  const onAddClick = useCallback(() => {
    const input = {
      type: 'midi',
      targetNodeIds: [selectedParam.id],
      options: engine.plugins['midi-input'].generateInitialOptions(),
    }

    const id = addInput(input)
    setSelectedInputId(selectedParam.id, id)
  }, [addInput, selectedParam.id, setSelectedInputId])

  const inputs = useInputsWithNode(selectedParam.id)

  // TODO: "midi-input" should not be hardcoded here
  const PluginView = currentInput && pluginViews['midi-input'].inputPanel

  return (
    <>
      <MiniTabs className="mb-xl">
        {inputs.map((input) => (
          <MiniTabsItem
            key={input.id}
            isActive={selectedInputId === input.id}
            onClick={() => setSelectedInputId(selectedParam.id, input.id)}
          >
            {input.id}
          </MiniTabsItem>
        ))}
        <MiniTabsItem onClick={onAddClick}>
          <Icon name="add" />
        </MiniTabsItem>
      </MiniTabs>
      <div>{PluginView && <PluginView input={currentInput} engine={engine} />}</div>
    </>
  )
}
