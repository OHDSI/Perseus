import { ScanSettings } from './scan-settings';

export interface ScanSettingsWrapper {
  scanSettings: ScanSettings;

  getScanServiceDestination(): string;
}
