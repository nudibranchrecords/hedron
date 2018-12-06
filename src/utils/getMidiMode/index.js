import { cloneDeep, isEqual } from 'lodash'

/**
  Checks a few midi messages until it can work out what mode of midi controller
  is being used. Either relative (1-3) or absolute.
**/

// These values are the standard values a device will send for relative modes in midi
const allRels = [1, 63, 65, 127]

// [UP, DOWN]
const relVals = [
  [1, 127], // rel1
  [65, 63], // rel2
  [1, 65], // rel3
]

let storedVals = []
let lastData = false

export const clear = () => {
  storedVals = []
  lastData = false
}

export const newData = (data, type) => {
  const value = data[2]

  // Check to see if first two parts of data have stayed the same
  // since last time
  if (lastData && !isEqual(lastData, data.slice(0, -1))) {
    clear()
  } else {
    lastData = data.slice(0, -1)
  }

  // rel and abs only apply to controlChange, so everything else is ignored immediately
  if (type !== 'controlChange') {
    clear()
    return 'ignore'
  } else {
    // If the value isn't one of the relative values, must be absolute
    if (!allRels.includes(value)) {
      clear()
      return 'abs'
    } else {
      // If its a rel value, store in array
      storedVals.push(value)
      if (storedVals.length < 5) {
        // Learning if we dont have enough data to know yet
        return 'learning'
      } else {
        // We'll be checking against the rel value array above
        // but removing a value if we find it
        const checkArr = cloneDeep(relVals)

        let message = 'learning'
        // Go through values stored in array
        storedVals.forEach(val => {
          // Go through the rel values
          checkArr.forEach((arr, relIndex) => {
            const arrIndex = arr.indexOf(val)
            // If we match a rel value with our value, remove that
            // value from the 2 part array
            if (arrIndex !== -1) {
              arr.splice(arrIndex, 1)
              // Because we're removing values, if the array
              // is empty, we know this is the rel mode
              if (arr.length === 0) {
                clear()
                message = `rel${relIndex + 1}`
              }
            }
          })
        })
        return message
      }
    }
  }
}
