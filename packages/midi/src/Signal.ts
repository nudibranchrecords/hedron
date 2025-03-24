type func<T> = (value: T) => void

interface Listener<T> {
  listener: func<T>
  target?: unknown
}

/**
 * A simple class for dispatching signals to multiple listeners.
 */
export class Signal<T> {
  private _listeners: Listener<T>[] = []

  /**
   * Adds a listener to the signal.
   * @param listener The function to call when the signal is dispatched.
   * @param target The target to bind the listener to.
   */
  add(listener: func<T>, target?: unknown) {
    this._listeners.push({ listener, target })
  }

  /**
   * Removes a listener from the signal.
   * @param listener The function to remove.
   * @param target The target the listener was bound to.
   */
  remove(listener: func<T>, target?: unknown) {
    if (target) {
      this._listeners = this._listeners.filter(
        (l) => l.listener !== listener && l.target !== target,
      )
    } else {
      this._listeners = this._listeners.filter((l) => l.listener !== listener)
    }
  }

  /**
   * Removes all listeners bound to a target.
   * @param target The target
   */
  removeAll(target: unknown) {
    this._listeners = this._listeners.filter((l) => l.target !== target)
  }

  /**
   * Dispatches the signal to all listeners.
   * @param value The value to dispatch.
   */
  dispatch(value: T) {
    this._listeners.forEach((l) => l.listener.call(l.target, value))
  }
}
