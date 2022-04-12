export interface Lookup {
  id?: number
  name?: string
  isUserDefined?: boolean
  applied?: boolean
  originName?: string
  lookupType?: string
  sourceToSourceIncluded?: boolean
  source_to_source?: string
  source_to_standard?: string
  value?: string
}
