export interface ScanDataParams {
  sampleSize: number;
  scanValues: boolean;
  minCellCount: number;
  maxValues: number;
  calculateNumericStats: boolean;
  numericStatsSamplerSize: number;
}
