import { EtlMapping } from '@models/perseus/etl-mapping'
import { SourceTableResponse } from '@models/perseus/source-table-response'

export interface UploadScanReportResponse {
  etl_mapping: EtlMapping
  source_tables: SourceTableResponse[]
}
