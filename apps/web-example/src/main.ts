import { engineStore } from './engine'

const lfoInputEnabledNodeId = '40fed25628e9750c'
const saturationNodeId = 'bff7540d69fbd802'
const sphereScaleNodeId = '0434cc9f5cc59b70'

const satMinNodeId = `${saturationNodeId}-sliderMin`
const satMaxNodeId = `${saturationNodeId}-sliderMax`
const sphereScaleMinNodeId = `${sphereScaleNodeId}-sliderMin`
const sphereScaleMaxNodeId = `${sphereScaleNodeId}-sliderMax`

document.addEventListener('click', () => {
  const state = engineStore.getState()
  const nodeVal = state.nodeValues[lfoInputEnabledNodeId] as boolean

  state.updateNodeValue(lfoInputEnabledNodeId, !nodeVal)
})

document.addEventListener('mousemove', (e) => {
  const state = engineStore.getState()
  const satMin = state.nodeValues[satMinNodeId] as number
  const satMax = state.nodeValues[satMaxNodeId] as number
  const saturation = (e.clientX / window.innerWidth) * (satMax - satMin) + satMin

  const sphereScaleMin = state.nodeValues[sphereScaleMinNodeId] as number
  const sphereScaleMax = state.nodeValues[sphereScaleMaxNodeId] as number
  const sphereScale =
    (e.clientY / window.innerHeight) * (sphereScaleMax - sphereScaleMin) + sphereScaleMin

  state.updateNodeValue(sphereScaleNodeId, sphereScale)
  state.updateNodeValue(saturationNodeId, saturation)
})
