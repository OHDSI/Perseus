export enum ProgressNotificationStatusCode {
  STARTED_SCANNING = 0,
  TABLE_SCANNING = 1,
  SCAN_REPORT_GENERATED = 2,
  ERROR = 3,
  FAILED_TO_SCAN = 4,
  CANCELED = 5,
  NONE = 6
}

export interface ProgressNotificationStatus {
  code: number;
  description: string;
}

export interface ProgressNotification {
  message: string;
  status: ProgressNotificationStatus;
}
