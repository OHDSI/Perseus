export interface Lookup {
  id?: number
  name?: string
  updatedName?: string
  originName?: string
  lookupType?: string
  value?: string

  isUserDefined?: boolean
  applied?: boolean
  sourceToSourceIncluded?: boolean
  source_to_source?: string
  source_to_standard?: string
}

export interface LookupForEtlConfiguration {
  id: number | null
  name: string
  lookupType: string,
  sourceToSourceIncluded: boolean,
  applied?: boolean
}
