import { forwardRef, useImperativeHandle, useRef } from 'react'
import { EnumOption } from 'src/engine/store/types'

export type EnumDropdownHandle = {
  setValue: (value: string) => void
}

interface EnumDropdownProps {
  values: EnumOption[]
  onValueChange: (val: string) => void
}

export const EnumDropdown = forwardRef<EnumDropdownHandle, EnumDropdownProps>(function EnumDropdown(
  { values, onValueChange },
  ref,
) {
  const selectRef = useRef<HTMLSelectElement>(null)

  const setValue = (value: string) => {
    if (selectRef.current) {
      selectRef.current.value = value;
      onValueChange(value);
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onValueChange(event.target.value);
  }

  useImperativeHandle(ref, () => {
    return { setValue }
  }, [])

  return (
    <select ref={selectRef} onChange={handleChange}>
      {values.map((value) => (
        <option key={value.label} value={value.value}>
          {value.value}
        </option>
      ))}
    </select>
  )
})