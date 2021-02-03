export enum ProgressNotificationStatusCode {
  STARTED = 0,
  IN_PROGRESS = 1,
  FINISHED = 2,
  ERROR = 3,
  FAILED = 4,
  CANCELED = 5,
  NONE = 6
}

export interface ProgressNotificationStatus {
  code: number;
  description?: string;
}

export interface ProgressNotification {
  message: string;
  status?: ProgressNotificationStatus | string;
}

export interface CdmProgressNotification {
  text: string;
  status: ProgressNotificationStatusCode;
  progress: number;
}
