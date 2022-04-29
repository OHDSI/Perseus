import { FakeDataSettings } from '@models/white-rabbit/fake-data-settings'
import { ScanReportRequest } from '@models/perseus/scan-report-request'

export interface FakeDataRequest {
  settings: FakeDataSettings
  scanReportInfo: ScanReportRequest
}
