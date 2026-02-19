import { GamepadEvent, GamepadInputType } from './GamepadTypes'

const AXIS_DEADZONE = 0.01
const AXIS_LEARN_DURATION_MS = 100

/**
 * Manages gamepad connections and input events.
 */
export class GamepadManager {
  /**
   * List of registered listeners for gamepad events.
   */
  private listeners: Array<(event: GamepadEvent) => void> = []
  /**
   * Promise resolver for the current learn operation, if any.
   */
  private learnResolve: ((event: GamepadEvent | null) => void) | null = null
  /**
   * Start time of the learning process for axis inputs.
   */
  private learnStartTime: number = 0
  /**
   * Samples collected during axis learning. Used to determine the most significant axis.
   */
  private learnAxisSamples: Array<{ axis: number; controller: number; magnitude: number }> = []
  /**
   * ID of the animation frame for polling gamepads.
   */
  private animationFrameId: number | null = null
  /**
   * Previous states of connected gamepads for change detection.
   */
  private previousStates = new Map<number, Gamepad>()
  /**
   * Maps physical gamepad index to logical controller index (0-3)
   */
  private controllerMapping = new Map<number, number>()

  /**
   * Public interface for adding/removing gamepad event listeners.
   */
  public onGamepadEvent = {
    add: (listener: (event: GamepadEvent) => void) => {
      this.listeners.push(listener)
    },
    remove: (listener: (event: GamepadEvent) => void) => {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    },
  }

  constructor() {
    this.pollGamepads()
  }

  /**
   * Polls the connected gamepads and detects input changes.
   */
  private pollGamepads = () => {
    const gamepads = navigator.getGamepads()

    for (let i = 0; i < gamepads.length; i++) {
      const gamepad = gamepads[i]
      if (!gamepad) continue

      // Get the logical controller index (defaults to physical index)
      const logicalIndex = this.controllerMapping.get(i) ?? i

      const previousState = this.previousStates.get(i)

      // Check buttons
      gamepad.buttons.forEach((button, buttonIndex) => {
        const wasPressed = previousState?.buttons[buttonIndex]?.pressed ?? false
        const isPressed = button.pressed

        // Emit on button down
        if (isPressed && !wasPressed) {
          this.emitEvent({
            controllerIndex: logicalIndex,
            index: buttonIndex,
            inputType: GamepadInputType.Button,
            value: button.value,
            isPressed: true,
          })
        }
        // Emit on button up
        else if (!isPressed && wasPressed) {
          this.emitEvent({
            controllerIndex: logicalIndex,
            index: buttonIndex,
            inputType: GamepadInputType.Button,
            value: 0,
            isPressed: false,
          })
        }
      })

      // Check axes
      gamepad.axes.forEach((axisValue, axisIndex) => {
        const previousValue = previousState?.axes[axisIndex] ?? 0
        if (Math.abs(axisValue - previousValue) > AXIS_DEADZONE) {
          this.emitEvent({
            controllerIndex: logicalIndex,
            inputType: GamepadInputType.Axis,
            index: axisIndex,
            value: (axisValue + 1) / 2, // Normalize from [-1, 1] to [0, 1]
          })
        }
      })

      this.previousStates.set(i, gamepad)
    }

    this.animationFrameId = requestAnimationFrame(this.pollGamepads)
  }

  /**
   * Emits a gamepad event to all registered listeners.
   * @param event The gamepad event to emit.
   */
  private emitEvent(event: GamepadEvent) {
    this.listeners.forEach((listener) => listener(event))
    this.tryLearnResolve(event)
  }

  /**
   * Attempts to resolve the current learn operation based on the incoming event.
   * @param event The gamepad event to evaluate for learning.
   */
  private tryLearnResolve(event: GamepadEvent) {
    if (!this.learnResolve) {
      return
    }
    // For buttons, resolve immediately on press
    if (event.inputType === GamepadInputType.Button && event.isPressed) {
      this.learnResolve(event)
      this.learnResolve = null
      this.learnAxisSamples = []
    }
    // For axes, collect samples over time to find the most significant movement
    else if (event.inputType === GamepadInputType.Axis) {
      const now = Date.now()
      if (this.learnStartTime === 0) {
        this.learnStartTime = now
      }

      // Collect axis samples
      const magnitude = Math.abs(event.value - 0.5)
      this.learnAxisSamples.push({
        axis: event.index,
        controller: event.controllerIndex,
        magnitude,
      })

      if (now - this.learnStartTime > AXIS_LEARN_DURATION_MS) {
        // Find the top two axes with the strongest movement
        const sortedSamples = [...this.learnAxisSamples].sort((a, b) => b.magnitude - a.magnitude)

        const bestSample = sortedSamples[0]

        // Find the second strongest axis (if it exists and is different from the first)
        let secondaryIndex: number | undefined
        for (const sample of sortedSamples.slice(1)) {
          if (sample.axis !== bestSample.axis) {
            secondaryIndex = sample.axis
            break
          }
        }

        this.learnResolve({
          controllerIndex: bestSample.controller,
          inputType: GamepadInputType.Axis,
          index: bestSample.axis,
          value: 0.5,
          secondaryIndex,
        })
        this.learnResolve = null
        this.learnAxisSamples = []
        this.learnStartTime = 0
      }
    }
  }

  /**
   * Initiates the gamepad learning process.
   * @returns A promise that resolves with the learned gamepad event or null if canceled.
   */
  public gamepadLearn(): Promise<GamepadEvent | null> {
    this.cancelGamepadLearn()
    return new Promise((resolve) => {
      this.learnResolve = resolve
    })
  }

  /**
   * Cancels any ongoing gamepad learning process.
   */
  public cancelGamepadLearn() {
    if (this.learnResolve) {
      this.learnResolve(null)
      this.learnResolve = null
      this.learnAxisSamples = []
      this.learnStartTime = 0
    }
  }

  /**
   * Cleans up resources used by the GamepadManager.
   */
  public destroy() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId)
    }
  }

  /**
   * Sets the mapping from a physical gamepad index to a logical controller index.
   * @param physicalIndex The physical index of the gamepad.
   * @param logicalIndex The logical controller index to map to.
   */
  public setControllerMapping(physicalIndex: number, logicalIndex: number) {
    this.controllerMapping.set(physicalIndex, logicalIndex)
  }

  /**
   * Gets the logical controller index for a given physical gamepad index.
   * @param physicalIndex The physical index of the gamepad.
   * @returns The logical controller index.
   */
  public getControllerMapping(physicalIndex: number): number {
    return this.controllerMapping.get(physicalIndex) ?? physicalIndex
  }
}
