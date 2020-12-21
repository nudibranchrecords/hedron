
const setWeight = (action, weight) => {
  action.enabled = true
  action.setEffectiveTimeScale(1)
  action.setEffectiveWeight(weight)
}

const getActions = (clips, mixer) => {
  return clips.map(clip => {
    const action = mixer.clipAction(clip)
    action.play()
    setWeight(action, 0)

    return action
  })
}

module.exports = {
  setWeight, getActions,
}
