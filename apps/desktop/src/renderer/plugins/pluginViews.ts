import { ComponentType } from 'react'
import { createStore, useStore } from 'zustand'
import type {
  GlobalPanelProps,
  InputPanelProps,
  PluginViews,
  SketchPanelProps,
} from '@hedron-gl/plugin-sdk'

interface PluginViewsState {
  globalPanel: Record<string, ComponentType<GlobalPanelProps>>
  /** Keyed by input type rather than plugin id. */
  inputPanel: Record<string, ComponentType<InputPanelProps>>
  sketchCollapsible: Record<string, ComponentType<SketchPanelProps>>
  /** Small always-visible views in the strip under the viewer, such as the clock. */
  widget: Record<string, ComponentType>
  /** Which plugin registered each input panel, so unregistering removes the right ones. */
  inputPanelOwners: Record<string, string>
  /** Bumped on every change, for views that also read the (non-reactive) engine plugin list. */
  revision: number
}

export const pluginViewsStore = createStore<PluginViewsState>(() => ({
  globalPanel: {},
  inputPanel: {},
  sketchCollapsible: {},
  widget: {},
  inputPanelOwners: {},
  revision: 0,
}))

export const usePluginViews = <T>(selector: (state: PluginViewsState) => T) =>
  useStore(pluginViewsStore, selector)

const omitKeys = <V>(record: Record<string, V>, keys: (key: string) => boolean) =>
  Object.fromEntries(Object.entries(record).filter(([key]) => !keys(key)))

export const unregisterPluginViews = (pluginId: string) => {
  pluginViewsStore.setState((state) => ({
    globalPanel: omitKeys(state.globalPanel, (key) => key === pluginId),
    sketchCollapsible: omitKeys(state.sketchCollapsible, (key) => key === pluginId),
    widget: omitKeys(state.widget, (key) => key === pluginId),
    inputPanel: omitKeys(state.inputPanel, (key) => state.inputPanelOwners[key] === pluginId),
    inputPanelOwners: omitKeys(
      state.inputPanelOwners,
      (key) => state.inputPanelOwners[key] === pluginId,
    ),
    revision: state.revision + 1,
  }))
}

export const registerPluginViews = (pluginId: string, views: PluginViews = {}) => {
  unregisterPluginViews(pluginId)

  pluginViewsStore.setState((state) => {
    const inputPanel = { ...state.inputPanel }
    const inputPanelOwners = { ...state.inputPanelOwners }
    for (const [inputType, view] of Object.entries(views.inputPanel ?? {})) {
      inputPanel[inputType] = view
      inputPanelOwners[inputType] = pluginId
    }

    return {
      globalPanel: views.globalPanel
        ? { ...state.globalPanel, [pluginId]: views.globalPanel }
        : state.globalPanel,
      sketchCollapsible: views.sketchCollapsible
        ? { ...state.sketchCollapsible, [pluginId]: views.sketchCollapsible }
        : state.sketchCollapsible,
      widget: views.widget ? { ...state.widget, [pluginId]: views.widget } : state.widget,
      inputPanel,
      inputPanelOwners,
      revision: state.revision + 1,
    }
  })
}

const viewKeys = new WeakMap<object, number>()
let nextViewKey = 0

/** A stable key per component, so a reloaded plugin's new view remounts with a fresh error boundary. */
export const viewKey = (view: object) => {
  if (!viewKeys.has(view)) viewKeys.set(view, nextViewKey++)
  return viewKeys.get(view)!
}
