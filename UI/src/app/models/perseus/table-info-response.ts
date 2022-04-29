import { ColumnInfoResponse } from '@models/perseus/column-info-response'

export interface TableInfoResponse {
  table_name: string
  column_list: ColumnInfoResponse[]
}
