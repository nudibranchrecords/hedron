import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import c from './EnumDropdown.module.css'

export type EnumDropdownHandle = {
  setValue: (value: string) => void
}

export type EnumValue = string | number

type EnumOption = { value: EnumValue; label: string }

interface EnumDropdownProps {
  values: EnumOption[]
  value?: EnumValue
  onValueChange: (val: EnumValue) => void
}

export const EnumDropdown = forwardRef<EnumDropdownHandle, EnumDropdownProps>(function EnumDropdown(
  { value, values, onValueChange },
  ref,
) {
  const selectRef = useRef<HTMLSelectElement>(null)

  const setValue = useCallback((value: string) => {
    if (selectRef.current) {
      selectRef.current.value = value
    }
  }, [])

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onValueChange(event.target.value)
  }

  useImperativeHandle(ref, () => {
    return { setValue }
  }, [setValue])

  return (
    <div className={c.wrapper}>
      <select ref={selectRef} onChange={handleChange} className={c.wrapper} value={value}>
        {values.map((value) => (
          <option key={value.label} value={value.value}>
            {value.label}
          </option>
        ))}
      </select>
    </div>
  )
})
