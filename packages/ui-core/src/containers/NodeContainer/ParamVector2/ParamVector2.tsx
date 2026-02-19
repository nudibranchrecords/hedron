import { NodeParamVector2 } from '@hedron-gl/engine'
import c from './ParamVector2.module.css'
import { ParamNumber } from '@containers/NodeContainer/ParamNumber/ParamNumber'
import { useEngineStore } from '@hooks/storeHooks'

interface ParamVector2Props {
  id: string
}

export const ParamVector2 = ({ id }: ParamVector2Props) => {
  const node = useEngineStore((state) => state.nodes[id] as NodeParamVector2)

  const { childNodeIds } = node

  return (
    <div className={c.container}>
      {childNodeIds.map((childId) => (
        <div key={childId} className={c.item}>
          <ParamNumber key={childId} id={childId} />
        </div>
      ))}
    </div>
  )
}
