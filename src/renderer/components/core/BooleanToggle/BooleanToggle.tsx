import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import css from './BooleanToggle.module.css'

export type BooleanToggleHandle = {
  setChecked: (value: boolean) => void
}

interface BooleanToggleProps {
  onValueChange: (val: boolean) => void
}

export const BooleanToggle = forwardRef<BooleanToggleHandle, BooleanToggleProps>(
  function BooleanToggle({ onValueChange }, ref) {
    const checkboxRef = useRef<HTMLInputElement>(null)

    const setChecked = useCallback(
      (value: boolean) => {
        if (checkboxRef.current) {
          checkboxRef.current.checked = value
          onValueChange(value)
        }
      },
      [onValueChange],
    )

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onValueChange(event.target.checked)
    }

    useImperativeHandle(ref, () => {
      return { setChecked }
    }, [setChecked])

    return <input type="checkbox" className={css.input} ref={checkboxRef} onChange={handleChange} />
  },
)
