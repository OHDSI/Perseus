import { EtlConfiguration } from '@models/etl-configuration'
import { EtlMapping } from '@models/perseus/etl-mapping'

export interface UploadEtlMappingResponse {
  etl_mapping: EtlMapping
  etl_configuration: Record<string, EtlConfiguration>
}
