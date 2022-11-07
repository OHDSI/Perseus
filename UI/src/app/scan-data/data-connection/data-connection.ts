import { Type } from '@angular/core';
import { ConnectionResultWithTables } from '@app/models/white-rabbit/connection-result';
import { ScanSettings } from '@app/models/white-rabbit/scan-settings';
import { Observable } from 'rxjs';
import { DataConnectionSettingsComponent } from './data-connection-settings.component';

export abstract class DataConnection {

  abstract settingsComponent: Type<DataConnectionSettingsComponent>

  abstract testConnection(connectionSettings: ScanSettings): Observable<ConnectionResultWithTables>
}