import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import css from './TriggerPad.module.css'

export type TriggerPadHandle = {
  blink: () => void
}

export interface TriggerPadProps {
  onMouseDown: () => void
}

// void el.offsetWidth forces a reflow, retriggering the CSS animation
const pulseClass = (el: HTMLElement, className: string) => {
  el.classList.remove(className)
  void el.offsetWidth
  el.classList.add(className)
}

export const TriggerPad = forwardRef<TriggerPadHandle, TriggerPadProps>(function TriggerPad(
  { onMouseDown },
  ref,
) {
  const buttonRef = useRef<HTMLButtonElement>(null)

  const blink = useCallback(() => {
    const button = buttonRef.current
    if (!button) return

    pulseClass(button, css.blink)
  }, [])

  useImperativeHandle(ref, () => ({ blink }), [blink])

  const handleMouseDown = useCallback(() => {
    onMouseDown()
  }, [onMouseDown])

  return (
    <button className={css.triggerPad} onMouseDown={handleMouseDown} ref={buttonRef} type="button">
      <span className={css.label}></span>
    </button>
  )
})
