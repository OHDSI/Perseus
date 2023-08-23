import { DataConnectionService } from '@app/data-connection/data-connection.service'
import { ProgressLog } from '@models/progress-console/progress-log'

export interface Conversion {
  id: number
  project: string
  statusCode: number,
  statusName: string
  logs: ProgressLog[]
  // dataConnectionService?: DataConnectionService
}
