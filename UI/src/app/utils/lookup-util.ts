import { IConnection } from '@models/connector.interface';

export function getLookupType(arrow: IConnection) {
  return arrow.connector.target.name.endsWith('source_concept_id') ? 'source_to_source' : 'source_to_standard';
}
