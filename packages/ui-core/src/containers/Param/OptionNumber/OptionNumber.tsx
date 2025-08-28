import { useRef } from 'react'

import { useOnNodeValueChange } from '@hooks/useOnNodeValueChange'
import { useSubscribeToNodeValue } from '@hooks/useSubscribeToNodeValue'
import { NumberInput, NumberInputHandle } from '@components/NumberInput/NumberInput'
import {
  NodeControl,
  NodeControlInner,
  NodeControlMain,
  NodeControlTitle,
} from '@components/NodeControl/NodeControl'

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
