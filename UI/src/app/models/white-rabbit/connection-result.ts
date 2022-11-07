import { TableToScan } from '@models/white-rabbit/table-to-scan'

export interface ConnectionResult {
  canConnect: boolean
  message?: string
}

export interface ConnectionResultWithTables extends ConnectionResult {
  canConnect: boolean
  message?: string
  tableNames?: string[]
  tablesToScan: TableToScan[]
}
