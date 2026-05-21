import { ParamFileValueNonEmpty } from '@hedron-gl/engine'

const ACCEPTED_TOP_LEVEL_TYPES = new Set(['audio', 'image', 'video'])

const matchesAcceptToken = (file: ParamFileValueNonEmpty, acceptToken: string) => {
  const normalizedToken = acceptToken.trim().toLowerCase()
  if (!normalizedToken) {
    return false
  }

  if (normalizedToken.startsWith('.')) {
    return file.fileName.toLowerCase().endsWith(normalizedToken)
  }

  if (normalizedToken.endsWith('/*')) {
    const topLevelType = normalizedToken.slice(0, -2)
    return (
      ACCEPTED_TOP_LEVEL_TYPES.has(topLevelType) &&
      file.contentType.toLowerCase().startsWith(`${topLevelType}/`)
    )
  }

  return file.contentType.toLowerCase() === normalizedToken
}

export const filterAvailableFiles = (
  availableFiles: ParamFileValueNonEmpty[],
  accept?: string[] | null,
) => {
  if (!accept?.length) {
    return availableFiles
  }

  return availableFiles.filter((file) =>
    accept.some((acceptToken) => matchesAcceptToken(file, acceptToken)),
  )
}
