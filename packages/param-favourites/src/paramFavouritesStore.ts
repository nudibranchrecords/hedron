import { ParamValue } from '@hedron-gl/engine'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export interface ParamFavouriteStoreItem {
  title: string
  params: Record<string, ParamValue>
}

interface ParamFavouritesStoreState {
  byModuleId: Record<string, Record<string, ParamFavouriteStoreItem>>
  addFavourite: (
    moduleId: string,
    favouriteTitle: string,
    params: Record<string, ParamValue>,
  ) => void
  deleteFavourite: (moduleId: string, favouriteId: string) => void
  overwriteFavourite: (
    moduleId: string,
    favouriteId: string,
    params: Record<string, ParamValue>,
  ) => void
  editFavouriteTitle: (moduleId: string, favouriteId: string, newTitle: string) => void
}

export const useParamFavouritesStore = create<ParamFavouritesStoreState>()(
  persist(
    immer((set) => ({
      byModuleId: {},
      addFavourite: (moduleId, favouriteTitle, params) => {
        const favouriteId = crypto.randomUUID()

        set((state) => {
          state.byModuleId[moduleId] ??= {}
          state.byModuleId[moduleId][favouriteId] = {
            title: favouriteTitle,
            params,
          }
        })
      },
      deleteFavourite: (moduleId, favouriteId) => {
        set((state) => {
          const moduleFavourites = state.byModuleId[moduleId]
          if (!moduleFavourites) return

          delete moduleFavourites[favouriteId]
        })
      },
      overwriteFavourite: (moduleId, favouriteId, params) => {
        set((state) => {
          const moduleFavourites = state.byModuleId[moduleId]
          if (!moduleFavourites) return

          const targetFavourite = moduleFavourites[favouriteId]
          if (!targetFavourite) return

          targetFavourite.params = params
        })
      },
      editFavouriteTitle: (moduleId, favouriteId, newTitle) => {
        set((state) => {
          const moduleFavourites = state.byModuleId[moduleId]
          if (!moduleFavourites) return

          const targetFavourite = moduleFavourites[favouriteId]
          if (!targetFavourite) return

          targetFavourite.title = newTitle
        })
      },
    })),
    {
      name: 'hedron-param-favourites',
    },
  ),
)
