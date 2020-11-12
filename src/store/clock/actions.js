export function clockBeatInc () {
  return {
    type: 'CLOCK_BEAT_INC',
  }
}

export function clockBpmUpdate (bpm) {
  return {
    type: 'CLOCK_BPM_UPDATE',
    payload: {
      bpm,
    },
  }
}

export function uClockReset () {
  return {
    type: 'U_CLOCK_RESET',
  }
}

export function rClockReset () {
  return {
    type: 'R_CLOCK_RESET',
  }
}

export function clockSnap () {
  return {
    type: 'CLOCK_SNAP',
  }
}
