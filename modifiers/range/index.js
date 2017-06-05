const r = 2

module.exports = function (control, val) {
  const lower = (control[0] * r * 2) - r
  const upper = (control[1] * r * 2) - r
  const perc = r - (r - upper) - lower
  return (val * perc) + lower
}

