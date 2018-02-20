module.exports = function (control, val) {
  const lower = control[0]
  const upper = control[1]
  const perc = upper - lower
  return (val * perc) + lower
}
