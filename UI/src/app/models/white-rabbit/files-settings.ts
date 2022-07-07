import { ScanDataParams } from './scan-data-params';
import { TableToScan } from './table-to-scan';
import { ScanSettings } from './scan-settings';

export interface FilesSettings extends ScanSettings {
  fileType: string;
  delimiter: string;
  files?: File[];
  scanDataParams?: ScanDataParams;
}

export class DelimitedTextFileSettingsBuilder {
  private fileSettings: FilesSettings;
  private scanDataParams: ScanDataParams;
  private tablesToScan: TableToScan[];
  private files: File[];
  private fileType: string;

  setFileSettings(fileSettings: FilesSettings) {
    this.fileSettings = fileSettings;
    return this;
  }

  setScanParams(scanParams: ScanDataParams) {
    this.scanDataParams = scanParams;
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

  build(): FilesSettings {
    const result = {...this.fileSettings}
    const filteredFiles = this.tablesToScan
      .filter(table => table.selected)
      .map(table =>
        this.files.find(file => file.name === table.tableName)
      );
    result.fileType = this.fileType;
    result.scanDataParams = this.scanDataParams;
    result.files = filteredFiles;

    return result;
  }
}
