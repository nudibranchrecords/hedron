import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import css from './NumberInput.module.css'

export type NumberInputHandle = {
  updateValue: (value: number) => void
  focus?: () => void
}

export interface NumberInputProps extends React.HTMLAttributes<HTMLDivElement> {
  onValueChange: (val: number) => void
}

export const NumberInput = forwardRef<NumberInputHandle, NumberInputProps>(function NumberInput(
  { onValueChange, ...props },
  ref,
) {
  const currVal = useRef<number>(0)
  const numberInput = useRef<HTMLInputElement>(null!)

  const updateTextValue = useCallback((value: number) => {
    numberInput.current.value = value.toFixed(2)
  }, [])

  const updateValue = useCallback(
    (value: number) => {
      updateTextValue(value)

      currVal.current = value
    },
    [updateTextValue],
  )

  const commitInput = useCallback(() => {
    const text = numberInput.current.value
    // An untouched box shows the rounded value, so committing it would lose precision
    if (text === currVal.current.toFixed(2)) return
    const value = parseFloat(text)
    if (isNaN(value)) return
    updateValue(value)
    onValueChange(value)
  }, [updateValue, onValueChange])

  const onInputSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      commitInput()
    },
    [commitInput],
  )

  const onInputBlur = useCallback(() => {
    updateTextValue(currVal.current)
  }, [updateTextValue])

  const onInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Tab') {
        // Submit value on Tab
        commitInput()
        // Let Tab propagate for focus change
      } else if (e.key === 'Escape') {
        // Reset to last value and blur
        updateTextValue(currVal.current)
        numberInput.current.blur()
        e.preventDefault()
      }
    },
    [commitInput, updateTextValue],
  )

  const onInputFocus = useCallback(() => {
    numberInput.current.select()
  }, [])

  useImperativeHandle(ref, () => {
    return { updateValue, focus: () => numberInput.current.focus() }
  }, [updateValue])

  return (
    <div className={css.wrapper} {...props}>
      <form onSubmit={onInputSubmit} noValidate>
        <input
          type="number"
          className={css.textBox}
          ref={numberInput}
          onBlur={onInputBlur}
          onFocus={onInputFocus}
          onKeyDown={onInputKeyDown}
        />
      </form>
    </div>
  )
})
