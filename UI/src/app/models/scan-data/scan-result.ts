/**
 * @deprecated
 */
export enum ScanStatus {
  IN_PROGRESS,
  SUCCESSFULLY,
  FAILED
}

/**
 * @deprecated
 */
export interface ScanResult<T> {
  status: ScanStatus,
  payload?: T
}
