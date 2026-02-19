import { SketchModuleItem } from '@hedron-gl/engine'
import { useMemo, useState } from 'react'

export const useSketchesSearch = (sketchModules: SketchModuleItem[]) => {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredModules = useMemo(() => {
    if (!searchTerm) return sketchModules

    const query = searchTerm.toLowerCase()

    return [...sketchModules]
      .filter((item) => {
        const title = item.config.title.toLowerCase()
        return title.includes(query)
      })
      .sort((a, b) => {
        const aTitle = a.config.title.toLowerCase()
        const bTitle = b.config.title.toLowerCase()
        const aStarts = aTitle.startsWith(query)
        const bStarts = bTitle.startsWith(query)

        if (aStarts && !bStarts) return -1
        if (!aStarts && bStarts) return 1

        return aTitle.localeCompare(bTitle)
      })
  }, [searchTerm, sketchModules])

  return {
    searchTerm,
    setSearchTerm,
    filteredModules,
  }
}
