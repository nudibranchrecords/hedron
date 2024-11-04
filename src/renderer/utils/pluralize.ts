type PluralMap = { [key: string]: string }

const capitalizeFirstLetter = (word: string) => {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

// Add irregular plural words here, capitalisation is handled automatically
const _pluralMap: PluralMap = {
  sketch: 'sketches',
}

const pluralMap: PluralMap = {}

Object.keys(_pluralMap).forEach((key) => {
  pluralMap[key] = _pluralMap[key]
  pluralMap[capitalizeFirstLetter(key)] = capitalizeFirstLetter(_pluralMap[key])
})

export const pluralize = (word: string, num: number) => {
  if (num === 1) return word

  return pluralMap[word] ?? `${word}s`
}
