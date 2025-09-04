import { HedronEngine } from '@hedron/engine'
import './style.css'

const engine = new HedronEngine({
  rendererType: 'webgl',
})

engine.createCanvas(document.getElementById('root') as HTMLElement)

// Initialize sketches with relative URL
const initializeSketches = async () => {
  const url = 'sketches/'
  const moduleIds = ['solid'] // Add more sketch IDs as needed

  await engine.initiateSketchModules(url, moduleIds)
  engine.run()
}

initializeSketches().catch(console.error)
