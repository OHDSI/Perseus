import { HttpClient } from "@angular/common/http";
import { Type } from "@angular/core";
import { ConnectionResultWithTables } from "@app/models/white-rabbit/connection-result";
import { ScanSettings } from "@app/models/white-rabbit/scan-settings";
import { Observable } from "rxjs";
import { DataConnection } from "../data-connection";
import { DataConnectionSettingsComponent } from "../data-connection-settings.component";
import { DatabricksSettingsComponent } from "./databricks-settings.component";

export class DatabricksConnection extends DataConnection {

  settingsComponent: Type<DataConnectionSettingsComponent> = DatabricksSettingsComponent

  constructor(private http: HttpClient) {
    super();
  }

  testConnection(connectionSettings: ScanSettings): Observable<ConnectionResultWithTables> {
    return this.http.post<ConnectionResultWithTables>(`foo/test-connection`, connectionSettings);
  }
  
}