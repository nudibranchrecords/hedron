import { NodeParamRGB } from '@hedron/engine'
import { useInterval } from 'usehooks-ts'
import { useRef } from 'react'
import { ColorPicker } from '@hedron/ui-core'
import type { ColorPickerHandle } from '@hedron/ui-core'
import { useOnNodeVec3ValueChange } from '@components/hooks/useOnNodeVec3ValueChange'
import { engineStore, useEngineStore } from '@renderer/engine'

interface ParamRGBProps {
  id: string
}

export const ParamColor = ({ id }: ParamRGBProps) => {
  const ref = useRef<ColorPickerHandle>(null)
  const node = useEngineStore((state) => state.params[id] as NodeParamRGB)
  const { childNodeIds } = node

  useInterval(() => {
    const state = engineStore.getState()
    const paramValues = node.childNodeIds.map((id) => state.paramValues[id])

    ref.current?.updateColor(paramValues as [number, number, number])
  }, 100)

  const onVec3ValueChange = useOnNodeVec3ValueChange(
    childNodeIds[0],
    childNodeIds[1],
    childNodeIds[2],
  )

  return <ColorPicker ref={ref} onValueChange={onVec3ValueChange} />
}
