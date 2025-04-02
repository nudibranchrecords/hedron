import { useShallow } from 'zustand/react/shallow'
import { Icon, MiniTabs, MiniTabsItem, PopoutMenu } from '@hedron/ui-core'
import { useMemo } from 'react'
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

  const inputs = useInputsWithNode(selectedParam.id)

  // TODO: "midi-input" should not be hardcoded here
  const PluginView = currentInput && pluginViews['midi-input'].inputPanel

  const availableInputs = useMemo(
    () =>
      Object.values(engine.plugins).map((plugin) => ({
        label: plugin.name,
        onClick: () => {
          const input = {
            type: plugin.id,
            targetNodeIds: [selectedParam.id],
            options: plugin.generateInitialOptions(),
          }

          const id = addInput(input)
          setSelectedInputId(selectedParam.id, id)
        },
      })),
    [addInput, selectedParam.id, setSelectedInputId],
  )

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
        <PopoutMenu items={availableInputs}>
          <MiniTabsItem>
            <Icon name="add" />
          </MiniTabsItem>
        </PopoutMenu>
      </MiniTabs>
      <div>{PluginView && <PluginView input={currentInput} engine={engine} />}</div>
    </>
  )
}
