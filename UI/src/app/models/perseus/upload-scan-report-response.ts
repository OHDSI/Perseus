import { EtlMapping } from '@models/perseus/etl-mapping'
import { TableInfoResponse } from '@models/perseus/table-info-response'

export interface UploadScanReportResponse {
  etl_mapping: EtlMapping
  source_tables: TableInfoResponse[]
}
