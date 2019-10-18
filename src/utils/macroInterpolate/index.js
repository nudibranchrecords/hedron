export default (s, t, i, valueType) => {
  if (valueType === 'boolean') {
    // For boolean nodes, it switches to the target value when very close to 1
    return i > 0.99 ? t : s
  } else {
    return s + ((t - s) * i)
  }
}
