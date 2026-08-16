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
  IconName,
} from '@hedron-gl/ui-core'
import { useCallback, useMemo } from 'react'
import { IPlugin, ShotNode, ParamNode } from '@hedron-gl/engine'
import c from './SelectedNode.module.css'
import { pluginViews, engine, engineStore } from '@renderer/engine'
import { useInputsWithNode } from '@components/hooks/useInputsWithNode'

export const SelectedParamOrShot = ({ node }: { node: ParamNode | ShotNode }) => {
  const selectedInputId = useAppStore((state) => state.selectedInputs[node.id])
  const setSelectedInputId = useAppStore((state) => state.setSelectedInput)

  const currentInput = useEngineStore((state) =>
    selectedInputId ? state.nodes[selectedInputId] : null,
  )

  const inputs = useInputsWithNode(node.id)

  // TODO: Fix types here, maybe we need a "@hedron-gl/plugins" package to handle this sort of thing?
  // @ts-expect-error -- needs work
  const PluginView = currentInput && pluginViews.inputPanel[currentInput?.inputType]

  const availableInputs = useMemo(() => {
    const inputPlugins = Object.values(engine.plugins).filter(
      (plugin) => plugin.inputType,
    ) as (IPlugin & { inputType: string })[]

    return Object.values(inputPlugins).map((plugin) => ({
      label: (
        <>
          <Icon name={plugin.iconName as IconName} /> {plugin.name}
        </>
      ),
      onClick: () => {
        const newInput = engine.addInput(plugin.inputType, node.id)
        if (!newInput) return

        setSelectedInputId(node.id, newInput.id)
      },
    }))
  }, [node.id, setSelectedInputId])

  const onDeleteCurrentInput = useCallback(() => {
    if (currentInput) {
      engineStore.getState().deleteNode(currentInput.id)

      if (inputs.length > 1) {
        const otherInput = inputs.find((input) => input.id !== currentInput.id)
        if (otherInput) {
          setSelectedInputId(node.id, otherInput.id)
        }
      } else {
        setSelectedInputId(node.id, null)
      }
    }
  }, [currentInput, inputs, node.id, setSelectedInputId])

  return (
    <>
      <PanelSubHeader title={currentInput ? currentInput.title : 'No Inputs'} iconName={inputIcon}>
        {currentInput && (
          <PopoutMenu
            items={[
              {
                label: `Delete ${currentInput.title}`,
                icon: 'delete',
                onClick: onDeleteCurrentInput,
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
              onClick={() => setSelectedInputId(node.id, input.id)}
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
      {node.nodeType === 'param' && (
        <div>
          <PanelSubHeader title={`Parameter Options: ${node.valueType}`} iconName="settings" />

          {(() => {
            switch (node.valueType) {
              case 'number':
                return <ParamNumberOptions id={node.id} />
              default:
                return <i>No options yet for {node.valueType}</i>
            }
          })()}
        </div>
      )}
    </>
  )
}
