module.exports = function (control, val, prevVal) {
  if (control[0] === 0) {
    return val
  } else if (control[0] === 1) {
    // increment
    return (prevVal + val) % 1
  } else {
    // decrement
    return (((prevVal - val) % 1) + 1) % 1
  }
}
