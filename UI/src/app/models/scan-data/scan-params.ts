export interface ScanParams {
  sampleSize: number;
  scanValues: boolean;
  minCellCount: number;
  maxValues: number;
  calculateNumericStats: boolean;
  numericStatsSamplerSize: number;
}
