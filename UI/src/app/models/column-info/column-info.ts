export interface ValueInfo {
  value: string;
  frequency: string;
  percentage: string;
}

export interface ColumnInfo {
  type?: string;
  uniqueValues?: string;
  topValues?: ValueInfo[];
}

export enum ColumnInfoStatus {
  LOADING,
  READY,
  NO_INFO
}
