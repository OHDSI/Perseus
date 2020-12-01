import { ScanSettings } from './scan-settings';
import { ScanSettingsWrapper } from './scan-settings-wrapper';

export class DbSettingsWrapper implements ScanSettingsWrapper {
  scanSettings: ScanSettings;

  constructor(scanSettings: ScanSettings) {
    this.scanSettings = scanSettings;
  }

  getScanServiceDestination(): string {
    return '/scan-report/db';
  }
}
