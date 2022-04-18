import { IConnection } from '@models/connection';
import { Lookup } from '@models/perseus/lookup'
import { LookupRequest } from '@models/perseus/lookup-request'
import { LookupType } from '@models/perseus/lookup-type'

export function getLookupType(arrow: IConnection): LookupType {
  return arrow.connector.target.name.endsWith('source_concept_id') ? 'source_to_source' : 'source_to_standard';
}

export function toLookupRequest(lookup: Lookup): LookupRequest {
  return {
    name: lookup.name,
    source_to_source: lookup.source_to_source,
    source_to_standard: lookup.source_to_standard
  }
}
