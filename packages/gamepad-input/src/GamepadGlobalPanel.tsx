import React, { useState, useEffect, useCallback } from 'react'
import { HedronEngine, Input, Node, NodeValue } from '@hedron-gl/engine'
import {
  Panel,
  PanelHeader,
  PanelBody,
  useEngineStore,
  Card,
  CardBody,
  CardContent,
  Collapsible,
  ControlGrid,
  NodeContainer,
} from '@hedron-gl/ui-core'
import { GamepadInput } from './GamepadInput'
import styles from './GamepadGlobalPanel.module.css'
import { GamepadEvent } from './GamepadTypes'

interface GamepadGlobalPanelProps {
  engine: HedronEngine
}

interface ConnectedGamepad {
  physicalIndex: number
  id: string
  assignedIndex: number
}

interface DebugMessage {
  timestamp: number
  physicalIndex: number
  logicalIndex: number
  inputType: string
  index: number
  value: number
}

// Custom hook to manage connected gamepads
const useConnectedGamepads = (gamepadPlugin: GamepadInput | undefined) => {
  const [connectedGamepads, setConnectedGamepads] = useState<ConnectedGamepad[]>([])

  useEffect(() => {
    if (!gamepadPlugin) return

    const updateGamepads = () => {
      const gamepads = navigator.getGamepads()
      const connected: ConnectedGamepad[] = []

      for (let i = 0; i < gamepads.length; i++) {
        const gamepad = gamepads[i]

        if (gamepad) {
          connected.push({
            physicalIndex: i,
            id: gamepad.id,
            assignedIndex: gamepadPlugin.gamepadManager.getControllerMapping(i),
          })
        }
      }

      setConnectedGamepads(connected)
    }

    updateGamepads()
    const interval = setInterval(updateGamepads, 2000)
    return () => clearInterval(interval)
  }, [gamepadPlugin])

  return { connectedGamepads, setConnectedGamepads }
}

// Custom hook to manage gamepad events (flashing and debug messages)
const useGamepadEvents = (
  gamepadPlugin: GamepadInput | undefined,
  inputs: Record<string, Input>,
  nodes: Record<string, Node>,
  nodeValues: Record<string, NodeValue>,
) => {
  const [flashingInputs, setFlashingInputs] = useState<Set<string>>(new Set())
  const [flashingControllers, setFlashingControllers] = useState<Set<number>>(new Set())
  const [debugMessages, setDebugMessages] = useState<DebugMessage[]>([])
  const [lastEventPerController, setLastEventPerController] = useState<Map<number, GamepadEvent>>(
    new Map(),
  )

  useEffect(() => {
    if (!gamepadPlugin) return

    const handleEvent = (event: GamepadEvent) => {
      const physicalIndices = findPhysicalIndicesForLogicalController(
        event.controllerIndex,
        gamepadPlugin,
      )

      // Find matching inputs and flash them
      const matchingInputIds = findMatchingInputsForEvent(event, inputs, nodes, nodeValues)
      flashInputs(matchingInputIds, setFlashingInputs)

      // Flash controller card at reduced capacity
      flashControllers(physicalIndices, setFlashingControllers)

      addDebugMessage(event, physicalIndices[0] ?? -1, setDebugMessages)

      // Track last event per logical controller
      setLastEventPerController((prev) => new Map(prev).set(event.controllerIndex, event))
    }

    gamepadPlugin.gamepadManager.onGamepadEvent.add(handleEvent)
    return () => gamepadPlugin.gamepadManager.onGamepadEvent.remove(handleEvent)
  }, [gamepadPlugin, inputs, nodes, nodeValues])

  return { flashingInputs, flashingControllers, debugMessages, lastEventPerController }
}

// Helper: Find physical controller indices that map to a logical index
const findPhysicalIndicesForLogicalController = (
  logicalIndex: number,
  gamepadPlugin: GamepadInput,
): number[] => {
  const physicalIndices: number[] = []
  const gamepads = navigator.getGamepads()

  for (let i = 0; i < gamepads.length; i++) {
    if (gamepads[i] && gamepadPlugin.gamepadManager.getControllerMapping(i) === logicalIndex) {
      physicalIndices.push(i)
    }
  }

  return physicalIndices
}

// Helper: Find inputs that match a gamepad event
const findMatchingInputsForEvent = (
  event: GamepadEvent,
  inputs: Record<string, Input>,
  nodes: Record<string, Node>,
  nodeValues: Record<string, NodeValue>,
): string[] => {
  return Object.values(inputs)
    .filter((input) => {
      if (input.type !== 'gamepad') return false

      const controllerIndexNode = input.optionNodeIds.find(
        (nodeId: string) => nodes[nodeId]?.key === 'controllerIndex',
      )
      const inputTypeNode = input.optionNodeIds.find(
        (nodeId: string) => nodes[nodeId]?.key === 'inputType',
      )
      const indexNode = input.optionNodeIds.find((nodeId: string) => nodes[nodeId]?.key === 'index')

      if (!controllerIndexNode || !inputTypeNode || !indexNode) return false

      const controllerIndex = nodeValues[controllerIndexNode]
      const inputType = nodeValues[inputTypeNode]
      const index = nodeValues[indexNode]

      return (
        controllerIndex === event.controllerIndex &&
        inputType === event.inputType &&
        index === event.index
      )
    })
    .map((input) => input.id)
}

// Helper: Flash controllers briefly
const flashControllers = (
  physicalIndices: number[],
  setFlashingControllers: React.Dispatch<React.SetStateAction<Set<number>>>,
) => {
  physicalIndices.forEach((physicalIndex) => {
    setFlashingControllers((prev) => new Set(prev).add(physicalIndex))
    setTimeout(() => {
      setFlashingControllers((prev) => {
        const next = new Set(prev)
        next.delete(physicalIndex)
        return next
      })
    }, 300)
  })
}

// Helper: Flash inputs briefly
const flashInputs = (
  inputIds: string[],
  setFlashingInputs: React.Dispatch<React.SetStateAction<Set<string>>>,
) => {
  inputIds.forEach((inputId) => {
    setFlashingInputs((prev) => new Set(prev).add(inputId))
    setTimeout(() => {
      setFlashingInputs((prev) => {
        const next = new Set(prev)
        next.delete(inputId)
        return next
      })
    }, 300)
  })
}

// Helper: Add debug message
const addDebugMessage = (
  event: GamepadEvent,
  physicalIndex: number,
  setDebugMessages: React.Dispatch<React.SetStateAction<DebugMessage[]>>,
) => {
  setDebugMessages((prev) => {
    const newMessage: DebugMessage = {
      timestamp: Date.now(),
      physicalIndex,
      logicalIndex: event.controllerIndex,
      inputType: event.inputType,
      index: event.index,
      value: event.value,
    }
    return [newMessage, ...prev].slice(0, 100)
  })
}

// Helper: Get inputs for a specific controller
const getInputsForController = (
  controllerIndex: number,
  inputs: Record<string, Input>,
  nodes: Record<string, Node>,
  engine: HedronEngine,
) => {
  return Object.values(inputs).filter((input) => {
    if (input.type !== 'gamepad') return false

    const controllerIndexNode = input.optionNodeIds.find(
      (nodeId: string) => nodes[nodeId]?.key === 'controllerIndex',
    )
    if (!controllerIndexNode) return false

    const controllerIndexValue = engine.getStore().getState().nodeValues[controllerIndexNode]
    return controllerIndexValue === controllerIndex
  })
}

export const GamepadGlobalPanel: React.FC<GamepadGlobalPanelProps> = ({ engine }) => {
  const gamepadPlugin = engine.plugins['gamepad-input'] as GamepadInput | undefined
  const [expandedControllers, setExpandedControllers] = useState<Set<number>>(new Set())
  const [showDebug, setShowDebug] = useState(false)

  const inputs = useEngineStore((state) => state.inputs)
  const nodes = useEngineStore((state) => state.nodes)
  const nodeValues = useEngineStore((state) => state.nodeValues)
  const sketches = useEngineStore((state) => state.sketches)

  const { connectedGamepads, setConnectedGamepads } = useConnectedGamepads(gamepadPlugin)
  const { flashingInputs, flashingControllers, debugMessages, lastEventPerController } =
    useGamepadEvents(gamepadPlugin, inputs, nodes, nodeValues)

  const toggleExpanded = useCallback((physicalIndex: number) => {
    setExpandedControllers((prev) => {
      const next = new Set(prev)
      if (next.has(physicalIndex)) {
        next.delete(physicalIndex)
      } else {
        next.add(physicalIndex)
      }
      return next
    })
  }, [])

  const handleControllerAssignment = useCallback(
    (physicalIndex: number, logicalIndex: number) => {
      if (!gamepadPlugin) return
      gamepadPlugin.gamepadManager.setControllerMapping(physicalIndex, logicalIndex)
      setConnectedGamepads((prev) =>
        prev.map((gp) =>
          gp.physicalIndex === physicalIndex ? { ...gp, assignedIndex: logicalIndex } : gp,
        ),
      )
    },
    [gamepadPlugin, setConnectedGamepads],
  )

  if (!gamepadPlugin) {
    return <div className={styles.errorPanel}>Gamepad plugin not available</div>
  }

  if (connectedGamepads.length === 0) {
    return (
      <Panel>
        <PanelHeader>Gamepad Global Settings</PanelHeader>
        <PanelBody>
          <div className={styles.noGamepads}>
            No gamepads detected
            <br />
            <br />
            Try pressing any button on your gamepad
          </div>
        </PanelBody>
      </Panel>
    )
  }

  return (
    <Panel>
      <PanelHeader>Gamepad Global Settings</PanelHeader>
      <PanelBody>
        <GlobalSettings engine={engine} />
        <ControllerList
          connectedGamepads={connectedGamepads}
          expandedControllers={expandedControllers}
          flashingInputs={flashingInputs}
          flashingControllers={flashingControllers}
          inputs={inputs}
          nodes={nodes}
          nodeValues={nodeValues}
          sketches={sketches}
          engine={engine}
          toggleExpanded={toggleExpanded}
          handleControllerAssignment={handleControllerAssignment}
          lastEventPerController={lastEventPerController}
        />
        <DebugSection
          showDebug={showDebug}
          setShowDebug={setShowDebug}
          debugMessages={debugMessages}
        />
      </PanelBody>
    </Panel>
  )
}

// Component: Global Settings
interface GlobalSettingsProps {
  engine: HedronEngine
}

const GlobalSettings: React.FC<GlobalSettingsProps> = ({ engine }) => {
  const globalOptionNodeIds = engine.getPluginGlobalOptionNodeIds('gamepad-input')

  if (globalOptionNodeIds.length === 0) {
    return null
  }

  return (
    <ControlGrid className={styles.controlGrid}>
      {globalOptionNodeIds.map((id: string) => (
        <NodeContainer key={id} nodeId={id} />
      ))}
    </ControlGrid>
  )
}

// Component: Controller List
interface ControllerListProps {
  connectedGamepads: ConnectedGamepad[]
  expandedControllers: Set<number>
  flashingInputs: Set<string>
  flashingControllers: Set<number>
  inputs: Record<string, Input>
  nodes: Record<string, Node>
  nodeValues: Record<string, NodeValue>
  sketches: Record<string, { id: string; title: string; nodeIds: string[] }>
  engine: HedronEngine
  toggleExpanded: (physicalIndex: number) => void
  handleControllerAssignment: (physicalIndex: number, logicalIndex: number) => void
  lastEventPerController: Map<number, GamepadEvent>
}

const ControllerList: React.FC<ControllerListProps> = ({
  connectedGamepads,
  expandedControllers,
  flashingInputs,
  flashingControllers,
  inputs,
  nodes,
  nodeValues,
  sketches,
  engine,
  toggleExpanded,
  handleControllerAssignment,
  lastEventPerController,
}) => {
  return (
    <div className={styles.controllerList}>
      {connectedGamepads.map((gamepad) => {
        const isExpanded = expandedControllers.has(gamepad.physicalIndex)
        const isFlashing = flashingControllers.has(gamepad.physicalIndex)
        const controllerInputs = getInputsForController(
          gamepad.assignedIndex,
          inputs,
          nodes,
          engine,
        )

        return (
          <ControllerItem
            key={gamepad.physicalIndex}
            gamepad={gamepad}
            isExpanded={isExpanded}
            isFlashing={isFlashing}
            flashingInputs={flashingInputs}
            controllerInputs={controllerInputs}
            nodes={nodes}
            nodeValues={nodeValues}
            sketches={sketches}
            toggleExpanded={toggleExpanded}
            handleControllerAssignment={handleControllerAssignment}
            lastEvent={lastEventPerController.get(gamepad.assignedIndex)}
          />
        )
      })}
    </div>
  )
}

// Component: Controller Item
interface ControllerItemProps {
  gamepad: ConnectedGamepad
  isExpanded: boolean
  isFlashing: boolean
  flashingInputs: Set<string>
  controllerInputs: Input[]
  nodes: Record<string, Node>
  nodeValues: Record<string, NodeValue>
  sketches: Record<string, { id: string; title: string; nodeIds: string[] }>
  toggleExpanded: (physicalIndex: number) => void
  handleControllerAssignment: (physicalIndex: number, logicalIndex: number) => void
  lastEvent?: GamepadEvent
}

const ControllerItem: React.FC<ControllerItemProps> = ({
  gamepad,
  isExpanded,
  isFlashing,
  flashingInputs,
  controllerInputs,
  nodes,
  nodeValues,
  sketches,
  toggleExpanded,
  handleControllerAssignment,
  lastEvent,
}) => {
  // Find which input/parameter was affected by the last event
  const affectedParameter = React.useMemo(() => {
    if (!lastEvent) return null

    const matchingInput = controllerInputs.find((input) => {
      const inputTypeNode = input.optionNodeIds.find(
        (nodeId: string) => nodes[nodeId]?.key === 'inputType',
      )
      const indexNode = input.optionNodeIds.find((nodeId: string) => nodes[nodeId]?.key === 'index')

      if (!inputTypeNode || !indexNode) return false

      const inputType = nodeValues[inputTypeNode]
      const index = nodeValues[indexNode]

      return inputType === lastEvent.inputType && index === lastEvent.index
    })

    // Return event info whether or not there's a matching input
    const targetNode = matchingInput ? nodes[matchingInput.targetNodeId] : null

    // Find the sketch that contains this node by scanning all sketches
    let sketch = null
    if (matchingInput?.targetNodeId) {
      const foundSketch = Object.values(sketches).find((s) =>
        s.nodeIds?.includes(matchingInput.targetNodeId),
      )
      sketch = foundSketch || null
    }

    return {
      inputType: lastEvent.inputType,
      index: lastEvent.index,
      value: lastEvent.value,
      targetTitle: targetNode?.title || null,
      sketchTitle: sketch?.title || null,
      isRegistered: !!matchingInput,
    }
  }, [lastEvent, controllerInputs, nodes, nodeValues, sketches])
  return (
    <Card>
      <div className={isFlashing ? styles.activeCardSubtle : ''}>
        <div className={styles.controllerHeader}>
          <span>{gamepad.id}</span>
          <div className={styles.controllerAssignment}>
            <span className={styles.indexLabel}>Assign to:</span>
            <select
              className={styles.indexSelect}
              value={gamepad.assignedIndex}
              onChange={(e) =>
                handleControllerAssignment(gamepad.physicalIndex, parseInt(e.target.value))
              }
            >
              <option value={0}>Controller 1</option>
              <option value={1}>Controller 2</option>
              <option value={2}>Controller 3</option>
              <option value={3}>Controller 4</option>
            </select>
          </div>
        </div>

        <CardBody>
          {affectedParameter && (
            <div className={styles.lastEvent}>
              Last: {affectedParameter.inputType} {affectedParameter.index} (
              {affectedParameter.value.toFixed(3)}) →{' '}
              {affectedParameter.isRegistered ? (
                <>
                  {affectedParameter.sketchTitle && (
                    <span className={styles.sketchName}>{affectedParameter.sketchTitle} / </span>
                  )}
                  {affectedParameter.targetTitle}
                </>
              ) : (
                <span className={styles.notRegistered}>Not Registered</span>
              )}
            </div>
          )}
          <Collapsible
            title="Inputs Using This Controller"
            isOpen={isExpanded}
            onToggle={() => toggleExpanded(gamepad.physicalIndex)}
          >
            <CardContent>
              {controllerInputs.length > 0 ? (
                <div className={styles.nodeList}>
                  {controllerInputs.map((input) => {
                    const targetNode = nodes[input.targetNodeId]
                    const isFlashing = flashingInputs.has(input.id)
                    let type, index: number | string | undefined
                    input.optionNodeIds.forEach((nodeId) => {
                      const node = nodes[nodeId]
                      if (node.key === 'inputType') {
                        type = nodeValues[nodeId] as number
                      } else if (node.key === 'index') {
                        index = nodeValues[nodeId] as number
                      }
                    })
                    return (
                      <div
                        key={input.id}
                        className={`${styles.nodeItem} ${isFlashing ? styles.activeNodeItem : ''}`}
                      >
                        {type} {index} → {targetNode?.title || 'Unknown'}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className={styles.emptyMessage}>
                  No inputs configured for Controller {gamepad.assignedIndex + 1}
                </div>
              )}
            </CardContent>
          </Collapsible>
        </CardBody>
      </div>
    </Card>
  )
}

// Component: Debug Section
interface DebugSectionProps {
  showDebug: boolean
  setShowDebug: (show: boolean) => void
  debugMessages: DebugMessage[]
}

const DebugSection: React.FC<DebugSectionProps> = ({ showDebug, setShowDebug, debugMessages }) => {
  return (
    <div className={styles.debugSection}>
      <Collapsible title="Debug Messages" isOpen={showDebug} onToggle={setShowDebug}>
        <div className={styles.debugMessages}>
          {debugMessages.length > 0 ? (
            debugMessages.map((msg, idx) => (
              <div key={idx} className={styles.debugMessage}>
                <span className={styles.timestamp}>
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
                Physical: {msg.physicalIndex} → Logical: {msg.logicalIndex} | {msg.inputType}#
                {msg.index} = {msg.value.toFixed(3)}
              </div>
            ))
          ) : (
            <div className={styles.emptyMessage}>No messages yet</div>
          )}
        </div>
      </Collapsible>
    </div>
  )
}
