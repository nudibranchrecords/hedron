import { ParamVector2 as ParamVector2Type } from '@hedron-gl/engine'
import c from './ParamVector2.module.css'
import { ParamNumber } from '@containers/NodeContainer/ParamNumber/ParamNumber'
import { useEngineStore } from '@hooks/engineHooks'

interface ParamVector2Props {
  id: string
}

export const ParamVector2 = ({ id }: ParamVector2Props) => {
  const node = useEngineStore((state) => state.nodes[id] as ParamVector2Type)

  const { vectorComponentIds } = node.childGroups

  return (
    <div className={c.container}>
      {vectorComponentIds.map((childId) => (
        <div key={childId} className={c.item}>
          <ParamNumber key={childId} id={childId} />
        </div>
      ))}
    </div>
  )
}
