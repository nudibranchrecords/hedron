import { create, useStore } from 'zustand'
import { persist } from 'zustand/middleware'

const STORAGE_KEY = 'hedron-toggle-store'

interface ToggleState {
  openedItems: Record<string, boolean>
  toggleItem: (id: string) => void
  openItem: (id: string) => void
  closeItem: (id: string) => void
  setAll: (ids: string[], opened: boolean) => void
}

const toggleStore = create<ToggleState>()(
  persist(
    (set) => ({
      openedItems: {},
      toggleItem: (id: string) =>
        set((state) => ({
          openedItems: {
            ...state.openedItems,
            [id]: !state.openedItems[id],
          },
        })),
      openItem: (id: string) =>
        set((state) => ({
          openedItems: { ...state.openedItems, [id]: true },
        })),
      closeItem: (id: string) =>
        set((state) => ({
          openedItems: { ...state.openedItems, [id]: false },
        })),
      setAll: (ids: string[], opened: boolean) =>
        set((state) => {
          const newOpenedItems = { ...state.openedItems }
          ids.forEach((id) => {
            newOpenedItems[id] = opened
          })
          return { openedItems: newOpenedItems }
        }),
    }),
    { name: STORAGE_KEY },
  ),
)

/**
 * Returns the toggle store state and actions. Useful for toggle state that you want persisted (uses localStorage).
 */
export const useToggleStore = <T>(selector?: (state: ToggleState) => T) => {
  return useStore(toggleStore, selector!)
}

/**
 * Returns whether a specific item is opened.
 * Only re-renders when this specific item's open state changes.
 */
export function useIsItemOpened(id: string): boolean {
  return useToggleStore((state) => !!state.openedItems[id])
}
