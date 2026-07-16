import { HedronEngine, ParamNode, ParamValue, SketchNode } from '@hedron-gl/engine'
import { useMemo } from 'react'
import { ParamFavouritesControl } from './components/ParamFavouritesControl/ParamFavouritesControl'
import { useParamFavouritesStore } from './paramFavouritesStore'

const EMPTY_FAVOURITES = {} as Record<string, { title: string; params: Record<string, ParamValue> }>

interface ParamFavouritesPanelProps {
  sketchId: string
  engine: HedronEngine
}

export const ParamFavouritesPanel = ({ sketchId, engine }: ParamFavouritesPanelProps) => {
  const sketch = engine.getNode(sketchId) as SketchNode | undefined
  const moduleId = sketch?.moduleId

  const addFavourite = useParamFavouritesStore((state) => state.addFavourite)
  const deleteFavourite = useParamFavouritesStore((state) => state.deleteFavourite)
  const overwriteFavourite = useParamFavouritesStore((state) => state.overwriteFavourite)
  const editFavouriteTitle = useParamFavouritesStore((state) => state.editFavouriteTitle)

  const moduleFavourites = useParamFavouritesStore((state) => {
    if (!moduleId) return EMPTY_FAVOURITES
    return state.byModuleId[moduleId] ?? EMPTY_FAVOURITES
  })

  const favourites = useMemo(() => {
    return Object.entries(moduleFavourites).map(([id, item]) => ({
      id,
      name: item.title,
    }))
  }, [moduleFavourites])

  const getSketchParamKeyToIdMap = (): Record<string, string> => {
    if (!sketch) return {}

    return sketch.childGroups.nodeIds.reduce(
      (acc, nodeId) => {
        const node = engine.getNode(nodeId) as ParamNode | undefined
        if (!node || node.nodeType !== 'param') return acc

        acc[node.key] = node.id
        return acc
      },
      {} as Record<string, string>,
    )
  }

  const handleFavouriteSelect = (favouriteId: string) => {
    if (!sketch) return

    const favourite = moduleFavourites[favouriteId]
    if (!favourite) return

    const keyToIdMap = getSketchParamKeyToIdMap()
    const paramEntries = Object.entries(favourite.params).reduce(
      (acc, [paramKey, value]) => {
        const paramId = keyToIdMap[paramKey]
        if (!paramId) return acc

        acc[paramId] = value
        return acc
      },
      {} as Record<string, ParamValue>,
    )

    engine.setMultipleParamValues(paramEntries)
  }

  const getCurrentParamsSnapshot = (): Record<string, ParamValue> | null => {
    if (!moduleId || !sketch) return null

    const keyToIdMap = getSketchParamKeyToIdMap()

    return Object.entries(keyToIdMap).reduce(
      (acc, [paramKey, paramId]) => {
        const val = engine.getParamValue(paramId)
        if (val !== undefined) {
          acc[paramKey] = val
        }
        return acc
      },
      {} as Record<string, ParamValue>,
    )
  }

  const handleFavouriteSave = (favouriteName: string) => {
    if (!moduleId) return

    const vals = getCurrentParamsSnapshot()
    if (!vals) return

    addFavourite(moduleId, favouriteName, vals)
  }

  const handleFavouriteDelete = (favouriteId: string) => {
    if (!moduleId) return
    deleteFavourite(moduleId, favouriteId)
  }

  const handleFavouriteOverwrite = (favouriteId: string) => {
    if (!moduleId) return

    const vals = getCurrentParamsSnapshot()
    if (!vals) return

    overwriteFavourite(moduleId, favouriteId, vals)
  }

  const handleFavouriteEditTitle = (favouriteId: string, newName: string) => {
    if (!moduleId) return

    const trimmedName = newName.trim()
    if (!trimmedName) return

    editFavouriteTitle(moduleId, favouriteId, trimmedName)
  }

  return (
    <ParamFavouritesControl
      favourites={favourites}
      onFavouriteSelect={handleFavouriteSelect}
      onFavouriteSave={handleFavouriteSave}
      onFavouriteDelete={handleFavouriteDelete}
      onFavouriteOverwrite={handleFavouriteOverwrite}
      onFavouriteEditTitle={handleFavouriteEditTitle}
    />
  )
}
