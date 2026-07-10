export interface Resource {
  contentType: string
  fileName: string
  filePath: string
  lastModified: number
}

export type Resources = Record<string, Resource>
