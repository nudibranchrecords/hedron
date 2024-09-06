import { useMemo } from 'react'
import { useAppStore } from '../useAppStore'

export const useSketchModuleList = () => {
  const modules = useAppStore((state) => state.sketchModules)
  const list = useMemo(() => Object.values(modules), [modules])

  return list
}
