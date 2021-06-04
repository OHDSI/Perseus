export enum ScanStatus {
  IN_PROGRESS,
  SUCCESSFULLY,
  FAILED
}

export interface ScanResult<T> {
  status: ScanStatus,
  payload?: T
}
