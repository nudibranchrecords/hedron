import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import css from './NumberInput.module.css'

export type NumberInputHandle = {
  updateValue: (value: number) => void
  focus: () => void
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

  const onInputSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const input = numberInput.current

      if (input) {
        const value = parseFloat(input.value)
        if (!isNaN(value)) {
          updateValue(value)
          onValueChange(value)
        }
      }
    },
    [updateValue, onValueChange],
  )

  const onInputBlur = useCallback(() => {
    updateTextValue(currVal.current)
  }, [updateTextValue])

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
        />
      </form>
    </div>
  )
})
