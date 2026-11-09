import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as ReactDOMClient from 'react-dom/client'
import * as JsxRuntime from 'react/jsx-runtime'
import * as JsxDevRuntime from 'react/jsx-dev-runtime'
import * as Zustand from 'zustand'
import * as ZustandShallow from 'zustand/react/shallow'
import * as THREE from 'three'
import * as THREE_WEBGPU from 'three/webgpu'
import * as THREE_TSL from 'three/tsl'
import * as POSTPROCESSING from 'postprocessing'
import * as Engine from '@hedron-gl/engine'
import * as UiCore from '@hedron-gl/ui-core'
import * as AppStore from '@hedron-gl/app-store'
import * as PluginSdk from '@hedron-gl/plugin-sdk'
import type { SharedModule } from '@hedron-gl/plugin-sdk'

// Typed against SHARED_MODULES so adding a specifier there without providing it here fails typecheck
const modules: Record<SharedModule, unknown> = {
  react: React,
  'react-dom': ReactDOM,
  'react-dom/client': ReactDOMClient,
  'react/jsx-runtime': JsxRuntime,
  'react/jsx-dev-runtime': JsxDevRuntime,
  zustand: Zustand,
  'zustand/react/shallow': ZustandShallow,
  '@hedron-gl/engine': Engine,
  '@hedron-gl/ui-core': UiCore,
  '@hedron-gl/app-store': AppStore,
  '@hedron-gl/plugin-sdk': PluginSdk,
  three: THREE,
  'three/webgpu': THREE_WEBGPU,
  'three/tsl': THREE_TSL,
  postprocessing: POSTPROCESSING,
}

/** Exposes the host's module instances for plugin bundles, whose shared imports read from here. */
export const registerSharedModules = () => {
  window.__HEDRON = window.__HEDRON || {}
  window.__HEDRON.modules = modules
}
