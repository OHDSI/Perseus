import { EtlConfiguration } from '@models/etl-configuration'

export interface GenerateEtlArchiveRequest {
  name: string
  etl_mapping_id: number
  etl_configuration: Record<string, EtlConfiguration>
}
