export interface Resource {
  contentType: string
  fileName: string
  lastModified: number
}

export type Resources = Record<string, Resource>
