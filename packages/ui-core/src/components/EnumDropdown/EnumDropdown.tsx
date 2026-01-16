import { forwardRef, useCallback, useImperativeHandle, useMemo } from 'react'
import { NodeEnumValue } from '@hedron/engine'
import { Select } from '@base-ui/react/select'
import { Field } from '@base-ui/react/field'
import c from './EnumDropdown.module.css'

export type EnumDropdownHandle = {
  setValue: (value: string) => void
}

type EnumOption = { value: NodeEnumValue; label: string }

interface EnumDropdownProps {
  values: EnumOption[]
  value?: NodeEnumValue
  onValueChange: (val: NodeEnumValue) => void
}

export const EnumDropdown = forwardRef<EnumDropdownHandle, EnumDropdownProps>(function EnumDropdown(
  { value, values, onValueChange },
  ref,
) {
  // Convert to string-based items for Base UI
  const items = useMemo(
    () => values.map((v) => ({ value: String(v.value), label: v.label })),
    [values],
  )

  // Build lookup map for converting string back to original value
  const valueMap = useMemo(() => {
    const map = new Map<string, NodeEnumValue>()
    values.forEach((v) => map.set(String(v.value), v.value))
    return map
  }, [values])

  const stringValue = value !== undefined ? String(value) : undefined

  const handleValueChange = useCallback(
    (newValue: string | null) => {
      if (newValue !== null) {
        const originalValue = valueMap.get(newValue)
        if (originalValue !== undefined) {
          onValueChange(originalValue)
        }
      }
    },
    [onValueChange, valueMap],
  )

  // Note: setValue via ref is not directly supported by Base UI Select
  // The value should be controlled via the value prop instead
  useImperativeHandle(
    ref,
    () => ({
      setValue: (newValue: string) => {
        const originalValue = valueMap.get(newValue)
        if (originalValue !== undefined) {
          onValueChange(originalValue)
        }
      },
    }),
    [onValueChange, valueMap],
  )

  return (
    <Field.Root>
      <Select.Root value={stringValue} onValueChange={handleValueChange} items={items}>
        <Select.Trigger className={c.trigger}>
          <Select.Value placeholder="Select..." />
          <Select.Icon className={c.icon} />
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner className={c.positioner} sideOffset={4} alignItemWithTrigger={false}>
            <Select.Popup className={c.popup}>
              <Select.List>
                {items.map((option) => (
                  <Select.Item key={option.value} value={option.value} className={c.item}>
                    <Select.ItemText>{option.label}</Select.ItemText>
                    <Select.ItemIndicator className={c.itemIndicator}>
                      <CheckIcon />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </Field.Root>
  )
})

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
      <path d="M8.5 2.5L4 7L1.5 4.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  )
}
