import { createContext } from 'react'
import { ParamFileSource } from '@hedron-gl/engine'

export interface LocalPathPickerOptions {
  fileSource: Exclude<ParamFileSource, 'resource'>
  currentPath: string | null
}

/** Returns an absolute path, or null when the user cancels. Rejects on failure. */
export type LocalPathPicker = (options: LocalPathPickerOptions) => Promise<string | null>

export const LocalPathPickerContext = createContext<LocalPathPicker | null>(null)
export const LocalPathPickerProvider = LocalPathPickerContext.Provider
