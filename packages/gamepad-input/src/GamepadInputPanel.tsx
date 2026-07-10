import { useCallback, useState, useMemo } from 'react'
import { HedronEngine, InputNode } from '@hedron-gl/engine'
import {
  Button,
  ControlGrid,
  NodeContainer,
  useEngineStore,
  useNodeOptionNodes,
} from '@hedron-gl/ui-core'
import { GamepadInput } from './GamepadInput'
import { GamepadEvent, AxisMode, GamepadInputType } from './GamepadTypes'

interface IProps {
  input: InputNode
  engine: HedronEngine
}

const useGamepadLearn = (input: InputNode, engine: HedronEngine) => {
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
        input.childGroups.optionNodeIds.forEach((nodeId) => {
          const node = state.nodes[nodeId]
          if (!node || node.nodeType !== 'param') return
          switch (node.key) {
            case 'controllerIndex':
              state.updateParamValue(nodeId, event.controllerIndex)
              break
            case 'inputType':
              state.updateParamValue(nodeId, event.inputType)
              break
            case 'index':
              state.updateParamValue(nodeId, event.index)
              break
            case 'secondaryIndex':
              if (event.secondaryIndex !== undefined) {
                state.updateParamValue(nodeId, event.secondaryIndex)
              }
              break
          }
        })
      })
      .finally(() => {
        setIsLearning(false)
      })
  }, [engine, input.childGroups.optionNodeIds, gamepadManager])

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
  const paramValues = useEngineStore((state) => state.paramValues)

  const optionNodes = useNodeOptionNodes(input.id)

  const inputTypeNode = optionNodes['inputType']
  const axisModeNode = optionNodes['axisMode']

  const inputTypeValue = inputTypeNode ? paramValues[inputTypeNode.id] : null
  const axisModeValue = axisModeNode ? paramValues[axisModeNode.id] : null
  const targetNode = nodes[input.targetNodeId]
  const targetParamValueType = targetNode?.nodeType === 'param' ? targetNode.valueType : null

  // Memoize filtered node IDs to prevent unnecessary recalculations
  const visibleOptionNodeIds = useMemo(
    () =>
      input.childGroups.optionNodeIds.filter((id) => {
        const node = nodes[id]

        if (!node || !('key' in node)) {
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
            (targetParamValueType === 'number' || targetParamValueType === 'boolean')
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
    [input.childGroups.optionNodeIds, nodes, inputTypeValue, axisModeValue, targetParamValueType],
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
