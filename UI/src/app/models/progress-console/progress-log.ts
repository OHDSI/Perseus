import { ProgressLogStatus } from '@models/progress-console/progress-log-status'

export interface ProgressLog {
  message: string
  statusCode: ProgressLogStatus
  statusName: string
  percent: number
}
