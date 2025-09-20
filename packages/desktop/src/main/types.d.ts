import { HedronGlobal } from '@hedron/engine'

declare global {
  interface Window {
    __HEDRON: HedronGlobal
  }
}
