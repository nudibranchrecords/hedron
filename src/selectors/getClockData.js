// If we have a generated clock,
// return user defined BPM
// otherwise return calculated BPM
export default state => {
  const { settings, clock } = state

  return {
    beat: (clock.beat % 4) + 1,
    bar: (Math.floor(clock.beat / 4) % 4) + 1,
    phrase: (Math.floor(clock.beat / 16) % 4) + 1,
    bpm: settings.clockGenerated
      ? settings.clockBpm
      : clock.bpm,
  }
}

