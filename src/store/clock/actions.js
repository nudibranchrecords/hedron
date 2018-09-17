export function clockPulse () {
  return {
    type: 'CLOCK_PULSE'
  }
}

export function clockBeatInc () {
  return {
    type: 'CLOCK_BEAT_INC'
  }
}

export function clockBpmUpdate (bpm) {
  return {
    type: 'CLOCK_BPM_UPDATE',
    payload: {
      bpm
    }
  }
}

export function clockReset () {
  return {
    type: 'CLOCK_RESET'
  }
}

export function clockSnap () {
  return {
    type: 'CLOCK_SNAP'
  }
}
