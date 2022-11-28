import { DataConnectionSettingsComponent } from '@app/data-connection/data-connection-settings.component'
import { ProgressLog } from '@models/progress-console/progress-log'

export interface Conversion {
  id: number
  project: string
  statusCode: number,
  statusName: string
  logs: ProgressLog[]
  dataConnection?: DataConnectionSettingsComponent
}
