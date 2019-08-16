// If we have a generated clock,
// return user defined BPM
// otherwise return calculated BPM
export default state =>
  state.settings.clockGenerated
    ? state.settings.clockBpm
    : state.clock.bpm
