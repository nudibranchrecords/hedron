import { useMemo } from 'react'
import { useEngineStore } from '@renderer/engine'

export const useSketchModuleList = () => {
  const modules = useEngineStore((state) => state.sketchModules)
  const list = useMemo(() => Object.values(modules), [modules])

  return list
}
