import { useMemo } from 'react'
import { useEngineStore } from '../../engine'

export const useSketchModuleList = () => {
  const modules = useEngineStore((state) => state.sketchModules)
  const list = useMemo(() => Object.values(modules), [modules])

  return list
}
