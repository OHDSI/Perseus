import { ScanSettingsWrapper } from './scan-settings-wrapper';
import { ScanSettings } from './scan-settings';

export class FileSettingsWrapper implements ScanSettingsWrapper {
  scanSettings: ScanSettings;

  constructor(scanSettings: ScanSettings) {
    this.scanSettings = scanSettings;
  }

  getScanServiceDestination(): string {
    return '/scan-report/file';
  }
}
