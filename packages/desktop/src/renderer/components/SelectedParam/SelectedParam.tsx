import {
  Icon,
  MiniTabs,
  MiniTabsItem,
  PopoutMenu,
  useEngineStore,
  useAppStore,
  ParamNumberOptions,
  HedronErrorBoundary,
} from '@hedron/ui-core'
import { useMemo } from 'react'
import { useSelectedParam } from '@components/hooks/useSelectedParam'
import { pluginViews, engine } from '@renderer/engine'
import { useInputsWithNode } from '@components/hooks/useInput'

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

  // TODO: Fix types here, maybe we need a "@hedron/plugins" package to handle this sort of thing?
  // @ts-expect-error -- needs work
  const PluginView = currentInput && pluginViews.inputPanel[currentInput?.type]

  const availableInputs = useMemo(
    () =>
      Object.values(engine.plugins).map((plugin) => ({
        label: plugin.name,
        onClick: () => {
          const numAlready = inputs.filter((input) => input.type === plugin.inputType).length

          const input = {
            type: plugin.inputType,
            targetNodeId: selectedParam.id,
            title: `${plugin.inputType} ${numAlready + 1}`,
          }

          const id = addInput(input, plugin.optionNodesConfig)
          setSelectedInputId(selectedParam.id, id)
        },
      })),
    [addInput, inputs, selectedParam.id, setSelectedInputId],
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
            {input.title}
          </MiniTabsItem>
        ))}
        <PopoutMenu items={availableInputs}>
          <MiniTabsItem>
            <Icon name="add" />
          </MiniTabsItem>
        </PopoutMenu>
      </MiniTabs>
      <div className="mb-xl">
        <HedronErrorBoundary key={currentInput ? currentInput.id : 'no-input'}>
          {PluginView && <PluginView input={currentInput} engine={engine} />}
        </HedronErrorBoundary>
      </div>
      <div>
        <h3>Param Options: {selectedParam.valueType}</h3>
        {(() => {
          switch (selectedParam.valueType) {
            case 'number':
              return <ParamNumberOptions id={selectedParam.id} />
            default:
              return <i>No options yet for {selectedParam.valueType}</i>
          }
        })()}
      </div>
    </>
  )
}
