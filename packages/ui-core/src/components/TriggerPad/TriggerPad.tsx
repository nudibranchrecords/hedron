import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import css from './TriggerPad.module.css'

export type TriggerPadHandle = {
  blink: () => void
}

export interface TriggerPadProps {
  onClick: () => void
}

// void el.offsetWidth forces a reflow, retriggering the CSS animation
const pulseClass = (el: HTMLElement, className: string) => {
  el.classList.remove(className)
  void el.offsetWidth
  el.classList.add(className)
}

export const TriggerPad = forwardRef<TriggerPadHandle, TriggerPadProps>(function TriggerPad(
  { onClick },
  ref,
) {
  const buttonRef = useRef<HTMLButtonElement>(null)

  const blink = useCallback(() => {
    const button = buttonRef.current
    if (!button) return

    pulseClass(button, css.blink)
  }, [])

  useImperativeHandle(ref, () => ({ blink }), [blink])

  const handleClick = useCallback(() => {
    blink()
    onClick()
  }, [blink, onClick])

  return (
    <button className={css.triggerPad} onClick={handleClick} ref={buttonRef} type="button">
      <span className={css.label}></span>
    </button>
  )
})
