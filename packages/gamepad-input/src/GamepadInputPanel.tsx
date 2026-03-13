import { useCallback, useState, useMemo } from 'react'
import { findNodeWithKeyFromIdList, HedronEngine, Input } from '@hedron-gl/engine'
import { Button, ControlGrid, NodeContainer, useEngineStore } from '@hedron-gl/ui-core'
import { GamepadInput } from './GamepadInput'
import { GamepadEvent, AxisMode, GamepadInputType } from './GamepadTypes'

interface IProps {
  input: Input
  engine: HedronEngine
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
          if (!node || node.nodeType !== 'param') return
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
            case 'secondaryIndex':
              if (event.secondaryIndex !== undefined) {
                state.updateNodeValue(nodeId, event.secondaryIndex)
              }
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

  const nodes = useEngineStore((state) => state.nodes)
  const nodeValues = useEngineStore((state) => state.nodeValues)

  const inputTypeNode = findNodeWithKeyFromIdList(nodes, 'inputType', input.optionNodeIds)
  const axisModeNode = findNodeWithKeyFromIdList(nodes, 'axisMode', input.optionNodeIds)

  const inputTypeValue = inputTypeNode ? nodeValues[inputTypeNode.id] : null
  const axisModeValue = axisModeNode ? nodeValues[axisModeNode.id] : null
  const targetNode = nodes[input.targetNodeId]
  const targetNodeValueType = targetNode?.nodeType === 'param' ? targetNode.valueType : null

  // Memoize filtered node IDs to prevent unnecessary recalculations
  const visibleOptionNodeIds = useMemo(
    () =>
      input.optionNodeIds.filter((id) => {
        const node = nodes[id]

        if (!('key' in node)) {
          return false
        }

        // Hide triggerOn for axis inputs
        if (node?.key === 'triggerOn' && inputTypeValue === GamepadInputType.Axis) {
          return false
        }
        // Hide buttonMode unless it's a button input targeting a number or boolean
        if (node?.key === 'buttonMode') {
          return (
            inputTypeValue === GamepadInputType.Button &&
            (targetNodeValueType === 'number' || targetNodeValueType === 'boolean')
          )
        }
        // Hide axisMode unless it's an axis input
        if (node?.key === 'axisMode') {
          return inputTypeValue === GamepadInputType.Axis
        }
        // Hide secondaryIndex unless it's an axis input with a 2-axis mode
        if (node?.key === 'secondaryIndex') {
          return (
            inputTypeValue === GamepadInputType.Axis &&
            (axisModeValue === AxisMode.Angle || axisModeValue === AxisMode.Distance)
          )
        }
        // Hide gateButtonIndex unless it's an axis input
        if (node?.key === 'gateButtonIndex') {
          return inputTypeValue === GamepadInputType.Axis
        }
        // Hide angleOffset unless it's an axis input in angle mode
        if (node?.key === 'angleOffset') {
          return inputTypeValue === GamepadInputType.Axis && axisModeValue === AxisMode.Angle
        }
        return true
      }),
    [input.optionNodeIds, nodes, inputTypeValue, axisModeValue, targetNodeValueType],
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
