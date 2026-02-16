import { useEngineStore } from '@hedron-gl/ui-core'
import { useMemo } from 'react'

export const useSketchModuleList = () => {
  const modules = useEngineStore((state) => state.sketchModules)
  const list = useMemo(() => Object.values(modules), [modules])

  return list
}
