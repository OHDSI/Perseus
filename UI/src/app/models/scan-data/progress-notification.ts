export enum ProgressNotificationStatusCode {
  STARTED = 0,
  IN_PROGRESS = 1,
  FINISHED = 2,
  ERROR = 3, // Conversion continued
  FAILED = 4, // Conversion interrupted
  CANCELED = 5, // Conversion interrupted by User
  NONE = 6
}

export interface ProgressNotificationStatus {
  code: number;
  description?: string;
}

export interface ProgressNotification {
  message: string;
  status?: ProgressNotificationStatus;
}

export interface CdmProgressNotification {
  text: string;
  status: ProgressNotificationStatusCode;
  progress: number;
}

export function toFailedMessage(message: string) {
  return {
    message,
    status: {
      code: ProgressNotificationStatusCode.FAILED
    }
  }
}
