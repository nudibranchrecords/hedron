// https://en.wikipedia.org/wiki/Truncated_mean
export const calculateTrimmedMean = (arr: number[], trimPercent: number): number => {
  const sortedArr = arr.slice().sort((a, b) => a - b)
  const trimCount = Math.floor(sortedArr.length * trimPercent)
  const trimmedArr = sortedArr.slice(trimCount, sortedArr.length - trimCount)
  const sum = trimmedArr.reduce((acc, val) => acc + val, 0)
  return sum / trimmedArr.length
}
