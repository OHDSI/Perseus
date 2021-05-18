import { ScanParams } from './scan-params';
import { TableToScan } from './table-to-scan';
import { ScanSettings } from './scan-settings';

export interface DelimitedTextFileSettings extends ScanSettings {
  fileType: string;
  delimiter: string;
  itemsToScanCount?: number;
  files?: File[];
  scanParams?: ScanParams;
}

export class DelimitedTextFileSettingsBuilder {
  private fileSettings: DelimitedTextFileSettings;
  private scanParams: ScanParams;
  private tablesToScan: TableToScan[];
  private files: File[];
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

  setFilesToScan(files: File[]) {
    this.files = files;
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
      .map(table =>
        this.files.find(file => file.name === table.tableName)
      );

    result.fileType = this.fileType;
    result.scanParams = this.scanParams;
    result.itemsToScanCount = filteredFiles.length;
    result.files = filteredFiles;

    return result;
  }
}
