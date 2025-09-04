import { HedronEngine } from '@hedron/engine'
import './style.css'

const engine = new HedronEngine({
  rendererType: 'webgl',
})

engine.createCanvas(document.getElementById('root') as HTMLElement)
