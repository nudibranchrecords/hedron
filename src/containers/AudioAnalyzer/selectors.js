export const getBands = (state) => {
  const vals = state.inputs.values
  return [vals.audio_0, vals.audio_1, vals.audio_2, vals.audio_3]
}
