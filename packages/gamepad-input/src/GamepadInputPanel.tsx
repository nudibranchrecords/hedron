import { useCallback, useState, useMemo } from 'react'
import { HedronEngine, HedronEngineWithPlugin, Input } from '@hedron/engine'
import { Button, ControlGrid, NodeContainer, useEngineStore } from '@hedron/ui-core'
import { GamepadInput } from './GamepadInput'
import { GamepadEvent } from './GamepadTypes'

interface IProps {
  input: Input
  engine: HedronEngineWithPlugin<GamepadInput>
}

const useGamepadLearn = (input: Input, engine: HedronEngine) => {
  const [isLearning, setIsLearning] = useState(false)

  const plugin = engine.getPlugin('gamepad-input') as GamepadInput
  const gamepadManager = plugin.gamepadManager

  const runGamepadLearn = useCallback(async () => {
    setIsLearning(true)
    gamepadManager
      .gamepadLearn()
      .then((event: GamepadEvent | null) => {
        if (!event) {
          setIsLearning(false)
          return
        }

        const store = engine.getStore()
        const state = store.getState()

        // Update each option node with the learned values
        input.optionNodeIds.forEach((nodeId) => {
          const node = state.nodes[nodeId]
          if (!node) return
          switch (node.key) {
            case 'controllerIndex':
              state.updateNodeValue(nodeId, event.controllerIndex)
              break
            case 'inputType':
              state.updateNodeValue(nodeId, event.inputType)
              break
            case 'index':
              state.updateNodeValue(nodeId, event.index)
              break
          }
        })
      })
      .finally(() => {
        setIsLearning(false)
      })
  }, [engine, input.optionNodeIds, gamepadManager])

  const cancelGamepadLearn = useCallback(() => {
    gamepadManager.cancelGamepadLearn()
  }, [gamepadManager])

  return {
    isLearning,
    runGamepadLearn,
    cancelGamepadLearn,
  }
}

/**
 * A react component that displays the gamepad settings for a parameter
 */
export const GamepadInputPanel = ({ input, engine }: IProps) => {
  const { isLearning, runGamepadLearn, cancelGamepadLearn } = useGamepadLearn(input, engine)

  // Get nodes, inputType, and target node type in a single selector for efficiency
  const { nodes, inputTypeValue, targetNodeValueType } = useEngineStore(
    useCallback(
      (state) => {
        const inputTypeNode = input.optionNodeIds.find((id) => state.nodes[id]?.key === 'inputType')
        const targetNode = state.nodes[input.targetNodeId]
        return {
          nodes: state.nodes,
          inputTypeValue: inputTypeNode ? state.nodeValues[inputTypeNode] : null,
          targetNodeValueType: targetNode?.nodeType === 'param' ? targetNode.valueType : null,
        }
      },
      [input.optionNodeIds, input.targetNodeId],
    ),
  )

  // Memoize filtered node IDs to prevent unnecessary recalculations
  const visibleOptionNodeIds = useMemo(
    () =>
      input.optionNodeIds.filter((id) => {
        const node = nodes[id]
        // Hide triggerOn for axis inputs
        if (node?.key === 'triggerOn' && inputTypeValue === 'axis') {
          return false
        }
        // Hide buttonMode unless it's a button input targeting a number
        if (node?.key === 'buttonMode') {
          return inputTypeValue === 'button' && targetNodeValueType === 'number'
        }
        return true
      }),
    [input.optionNodeIds, nodes, inputTypeValue, targetNodeValueType],
  )

  return (
    <div>
      <ControlGrid className="mb-xl">
        {visibleOptionNodeIds.map((id) => (
          <NodeContainer key={id} nodeId={id} />
        ))}
      </ControlGrid>

      {isLearning ? (
        <Button type="neutral" onClick={cancelGamepadLearn}>
          Cancel
        </Button>
      ) : (
        <Button onClick={runGamepadLearn}>Gamepad Learn</Button>
      )}
    </div>
  )
}
