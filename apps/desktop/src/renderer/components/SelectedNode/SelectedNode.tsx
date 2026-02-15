import {
  Icon,
  MiniTabs,
  MiniTabsItem,
  PopoutMenu,
  useEngineStore,
  useAppStore,
  ParamNumberOptions,
  HedronErrorBoundary,
  inputIcon,
  PanelSubHeader,
  Button,
} from '@hedron-gl/ui-core'
import { useMemo } from 'react'
import c from './SelectedNode.module.css'
import { useSelectedNode } from '@components/hooks/useSelectedNode'
import { pluginViews, engine, engineStore } from '@renderer/engine'
import { useInputsWithNode } from '@components/hooks/useInput'

export const SelectedNode = () => {
  const selectedNode = useSelectedNode()

  if (!selectedNode) {
    throw new Error(
      'SelectedNode component: selected node not found. This component should only be used when a node is selected',
    )
  }

  const addInput = useEngineStore((state) => state.addInput)

  const selectedInputId = useAppStore((state) => state.selectedInputs[selectedNode.id])
  const setSelectedInputId = useAppStore((state) => state.setSelectedInput)

  const currentInput = useEngineStore((state) =>
    selectedInputId ? state.inputs[selectedInputId] : null,
  )

  const inputs = useInputsWithNode(selectedNode.id)

  // TODO: Fix types here, maybe we need a "@hedron-gl/plugins" package to handle this sort of thing?
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
            targetNodeId: selectedNode.id,
            title: `${plugin.inputType} ${numAlready + 1}`,
          }

          const id = addInput(input, plugin.optionNodesConfig)
          setSelectedInputId(selectedNode.id, id)
        },
      })),
    [addInput, inputs, selectedNode.id, setSelectedInputId],
  )

  return (
    <>
      <PanelSubHeader title={currentInput ? currentInput.title : 'No Inputs'} iconName={inputIcon}>
        {currentInput && (
          <PopoutMenu
            items={[
              {
                label: `Delete ${currentInput.title}`,
                icon: 'delete',
                onClick: () => engineStore.getState().deleteInput(currentInput.id),
              },
            ]}
          >
            <Button type="ghost" size="slim" iconName="more_horiz" />
          </PopoutMenu>
        )}
        <MiniTabs className="ml-auto">
          {inputs.map((input) => (
            <MiniTabsItem
              key={input.id}
              isActive={selectedInputId === input.id}
              onClick={() => setSelectedInputId(selectedNode.id, input.id)}
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
      </PanelSubHeader>

      <div className="mb-xl">
        <HedronErrorBoundary key={currentInput ? currentInput.id : 'no-input'}>
          {inputs.length === 0 && (
            <div className={c.noInputs}>Add inputs to this node using the plus (+) button</div>
          )}
          {PluginView && <PluginView input={currentInput} engine={engine} />}
        </HedronErrorBoundary>
      </div>
      {selectedNode.nodeType === 'param' && (
        <div>
          <PanelSubHeader
            title={`Parameter Options: ${selectedNode.valueType}`}
            iconName="settings"
          />

          {(() => {
            switch (selectedNode.valueType) {
              case 'number':
                return <ParamNumberOptions id={selectedNode.id} />
              default:
                return <i>No options yet for {selectedNode.valueType}</i>
            }
          })()}
        </div>
      )}
    </>
  )
}
