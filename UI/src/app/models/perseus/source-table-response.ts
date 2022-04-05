import { SourceColumnResponse } from '@models/perseus/source-column-response'

export interface SourceTableResponse {
  table_name: string
  column_list: SourceColumnResponse[]
}
