const hashTable = {}

const startTimer = (hash, count) => {
  hashTable[hash] = {
    pass: false,
    count: 0,
  }

  requestAnimationFrame(() => {
    hashTable[hash].pass = true
  })
}

export default (p) => {
  if (p.meta && p.meta.type === 'midi') {
    const v = hashTable[p.inputId]

    if (v === undefined) {
      startTimer(p.inputId)
      return 1
    } else if (v.pass) {
      startTimer(p.inputId)
      return v.count + 1
    } else {
      hashTable[p.inputId].count++
      return false
    }
  }

  return 1
}

// export default (p) => {
//   let meta, count
//   if (p.meta) {
//     meta = `${p.meta.type}${p.meta.noteOn}`
//     if (p.meta.type === 'lfo' || p.meta.type === 'audio') {
//       return 1
//     }
//   }
//   const hash = `${p.value}${p.inputId}${meta}`
//
//   requestAnimationFrame(() => {
//     hashTable[hash].pass = true
//   })
//
//   if (hashTable[hash] === undefined) {
//     hashTable[hash] = {
//       count: 1,
//       pass: false
//     }
//     return 1
//   } else if (!hashTable[hash].pass) {
//     hashTable[hash].count ++
//   } else {
//     return hashTable[hash].count
//   }
//
//   return count
// }
