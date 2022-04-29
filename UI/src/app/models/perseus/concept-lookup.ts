import { LookupForEtlConfiguration } from '@models/perseus/lookup'

export interface IConceptLookup {
  [key: string]: LookupForEtlConfiguration
}

export class ConceptLookup implements IConceptLookup {
  // @ts-ignore
  @Type(() => SimplifiedLookup)
  [key: string]: LookupForEtlConfiguration
}
