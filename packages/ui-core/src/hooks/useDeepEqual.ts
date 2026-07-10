import { fastIsEqual } from 'fast-is-equal'
import { useRef } from 'react'

export function useDeepEqual<S, U>(selector: (state: S) => U): (state: S) => U {
  const prev = useRef<U>(undefined)
  return (state) => {
    const next = selector(state)
    return fastIsEqual(prev.current, next) ? (prev.current as U) : (prev.current = next)
  }
}
