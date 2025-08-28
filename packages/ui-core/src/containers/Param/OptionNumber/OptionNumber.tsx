import { useRef } from 'react'
import {
  NodeControl,
  NodeControlInner,
  NodeControlMain,
  NodeControlTitle,
  NumberInput,
} from '@hedron/ui-core'
import type { NumberInputHandle } from '@hedron/ui-core'
import { useOnNodeValueChange } from '@hooks/useOnNodeValueChange'
import { useSubscribeToNodeValue } from '@hooks/useSubscribeToNodeValue'

interface ParamNumberProps {
  paramId: string
  optionKey: string
  optionTitle: string
}

export const OptionNumber = ({ paramId, optionKey, optionTitle }: ParamNumberProps) => {
  const onValueChange = useOnNodeValueChange(`${paramId}-${optionKey}`)

  const ref = useRef<NumberInputHandle>(null)

  useSubscribeToNodeValue<number>(`${paramId}-${optionKey}`, (value) => {
    ref.current?.updateValue(value)
  })

  return (
    <NodeControl>
      <NodeControlMain>
        <NodeControlTitle>{optionTitle}</NodeControlTitle>
        <NodeControlInner>
          <NumberInput ref={ref} onValueChange={onValueChange} />
        </NodeControlInner>
      </NodeControlMain>
    </NodeControl>
  )
}
