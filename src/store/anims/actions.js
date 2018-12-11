export function uAnimStart (linkId) {
  return {
    type: 'U_ANIM_START',
    payload: {
      linkId,
    },
  }
}
