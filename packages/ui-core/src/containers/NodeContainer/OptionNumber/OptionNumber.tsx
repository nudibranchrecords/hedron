import { useRef } from 'react'

import { useOnParamValueChange } from '@hooks/useOnParamValueChange'
import { useSubscribeToParamValue } from '@hooks/useSubscribeToParamValue'
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
  const onValueChange = useOnParamValueChange(`${paramId}-${optionKey}`)

  const ref = useRef<NumberInputHandle>(null)

  useSubscribeToParamValue<number>(`${paramId}-${optionKey}`, (value) => {
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
