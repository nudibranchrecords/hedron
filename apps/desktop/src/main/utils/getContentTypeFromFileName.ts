import path from 'path'

import { contentType } from 'mime-types'

export const getContentTypeFromFileName = (fileName: string): string => {
  const ext = path.extname(fileName).toLowerCase()
  return contentType(ext) || 'application/octet-stream'
}
