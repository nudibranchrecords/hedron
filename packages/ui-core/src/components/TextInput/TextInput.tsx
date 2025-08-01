import React, { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import css from './TextInput.module.css'

export type TextInputHandle = {
  setValue: (value: string) => void
}

interface TextInputProps {
  onValueChange: (val: string) => void
}

export const TextInput = forwardRef<TextInputHandle, TextInputProps>(function TextInput(
  { onValueChange },
  ref,
) {
  const inputRef = useRef<HTMLInputElement>(null)

  const setValue = useCallback((value: string) => {
    if (inputRef.current) {
      inputRef.current.value = value
    }
  }, [])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange(event.target.value)
  }

  useImperativeHandle(ref, () => {
    return { setValue }
  }, [setValue])

  return (
    <div className={css.wrapper}>
      <input type="text" className={css.input} ref={inputRef} onChange={handleChange} />
    </div>
  )
})
