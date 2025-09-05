import { HedronEngine, processConfig } from '@hedron/engine'
import module from './sketches/solid'
import config from './sketches/solid/config'

import './style.css'

const engine = new HedronEngine({
  rendererType: 'webgl',
})

engine.createCanvas(document.getElementById('root') as HTMLElement)

const moduleItem = {
  moduleId: 'solid',
  // TODO: This "as" can be removed if we
  config: processConfig(config, { fallBackTitle: 'Solid' }),
  module,
}

engine.getStore().getState().setSketchModuleItem(moduleItem)
