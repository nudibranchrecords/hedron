export const getBands = (state) => {
  const inputs = state.inputs
  return [inputs.audio_0.value, inputs.audio_1.value, inputs.audio_2.value, inputs.audio_3.value]
}
