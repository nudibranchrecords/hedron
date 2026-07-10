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
  const nodeVal = state.paramValues[lfoInputEnabledNodeId] as boolean

  state.updateParamValue(lfoInputEnabledNodeId, !nodeVal)
})

document.addEventListener('mousemove', (e) => {
  const state = engineStore.getState()
  const satMin = state.paramValues[satMinNodeId] as number
  const satMax = state.paramValues[satMaxNodeId] as number
  const saturation = (e.clientX / window.innerWidth) * (satMax - satMin) + satMin

  const sphereScaleMin = state.paramValues[sphereScaleMinNodeId] as number
  const sphereScaleMax = state.paramValues[sphereScaleMaxNodeId] as number
  const sphereScale =
    (e.clientY / window.innerHeight) * (sphereScaleMax - sphereScaleMin) + sphereScaleMin

  state.updateParamValue(sphereScaleNodeId, sphereScale)
  state.updateParamValue(saturationNodeId, saturation)
})
