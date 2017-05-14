module.exports = function (control, val) {
  const threshold = control[0]
  return val > threshold ? val : 0
}
