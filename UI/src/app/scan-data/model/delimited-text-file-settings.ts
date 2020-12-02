import { ScanParams } from './scan-params';
import { FileToScan } from './file-to-scan';
import { TableToScan } from './table-to-scan';
import { ScanSettings } from './scan-settings';

export interface DelimitedTextFileSettings extends ScanSettings {
  fileType: string;
  delimiter: string;
  itemsToScanCount?: number;
  filesToScan?: FileToScan[];
  scanParams?: ScanParams;
}

export class DelimitedTextFileSettingsBuilder {
  private fileSettings: DelimitedTextFileSettings;
  private scanParams: ScanParams;
  private tablesToScan: TableToScan[];
  private filesToScan: FileToScan[];
  private fileType: string;

  setFileSettings(fileSettings: DelimitedTextFileSettings) {
    this.fileSettings = fileSettings;
    return this;
  }

  setScanParams(scanParams: ScanParams) {
    this.scanParams = scanParams;
    return this;
  }

  setTableToScan(tablesToScan: TableToScan[]) {
    this.tablesToScan = tablesToScan;
    return this;
  }

  setFilesToScan(filesToScan: FileToScan[]) {
    this.filesToScan = filesToScan;
    return this;
  }

  setFileType(fileType: string) {
    this.fileType = fileType;
    return this;
  }

  build() {
    const result = Object.assign({}, this.fileSettings) as DelimitedTextFileSettings;
    const filteredFiles = this.tablesToScan
      .filter(table => table.selected)
      .map(table => ({
        fileName: table.tableName,
        base64: this.filesToScan
          .find(fileToScan => fileToScan.fileName === table.tableName)
          .base64
      }));

    result.fileType = this.fileType;
    result.scanParams = this.scanParams;
    result.itemsToScanCount = filteredFiles.length;
    result.filesToScan = filteredFiles;

    return result;
  }
}
