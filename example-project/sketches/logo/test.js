import isEven from 'is-even'

console.log('HEYYYYY!!!')

const nums = [1, 2]

nums.forEach((num) => {
  console.log(`${num} is even: ${isEven(num)}`)
})
