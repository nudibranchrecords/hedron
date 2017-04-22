module.exports = function (control, val) {
  const perc = 1 - control
  return (val * perc) + control
}
