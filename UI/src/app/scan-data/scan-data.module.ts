import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TablesToScanComponent } from './scan-data-dialog/scan-data-form/tables-to-scan/tables-to-scan.component';
import { TableToScanComponent } from './scan-data-dialog/scan-data-form/tables-to-scan/table-to-scan/table-to-scan.component';
import { ScanDataFormComponent } from './scan-data-dialog/scan-data-form/scan-data-form.component';
import { ScanParamsComponent } from './scan-data-dialog/scan-data-form/tables-to-scan/scan-params/scan-params.component';
import { ScanDataCheckboxComponent } from './shared/scan-data-checkbox/scan-data-checkbox.component';
import { ConnectionErrorPopupComponent } from './shared/connection-error-popup/connection-error-popup.component';
import { ScanDataDialogComponent } from './scan-data-dialog/scan-data-dialog.component';
import { ConnectFormComponent } from './scan-data-dialog/scan-data-form/connect-form/connect-form.component';
import { DbSettingsFormComponent } from './scan-data-dialog/scan-data-form/connect-form/db-settings-form/db-settings-form.component';
import { FileSettingsFormComponent } from './scan-data-dialog/scan-data-form/connect-form/file-settings-form/file-settings-form.component';
import { FakeDataDialogComponent } from './fake-data-dialog/fake-data-dialog.component';
import { FakeConsoleWrapperComponent } from './fake-data-dialog/fake-console-wrapper/fake-console-wrapper.component';
import { FakeDataFormComponent } from './fake-data-dialog/fake-data-form/fake-data-form.component';
import { ScanConsoleWrapperComponent } from './scan-data-dialog/scan-console-wrapper/scan-console-wrapper.component';
import { CdmDialogComponent } from './cdm-dialog/cdm-dialog.component';
import { CdmFormComponent } from './cdm-dialog/cdm-form/cdm-form.component';
import { CdmConnectFormComponent } from './cdm-dialog/cdm-form/cdm-connect-form/cdm-connect-form.component';
import { CdmFakeDataFormComponent } from './cdm-dialog/cdm-form/cdm-fake-data-form/cdm-fake-data-form.component';
import { TestConnectionComponent } from './shared/test-connection/test-connection.component';
import { CdmDestinationFormComponent } from './cdm-dialog/cdm-form/cdm-destination-form/cdm-destination-form.component';
import { CdmSourceFormComponent } from './cdm-dialog/cdm-form/cdm-source-form/cdm-source-form.component';
import { CdmConsoleWrapperComponent } from './cdm-dialog/cdm-console-wrapper/cdm-console-wrapper.component';
import { CdmConsoleComponent } from './cdm-dialog/cdm-console-wrapper/cdm-console/cdm-console.component';
import { ScanDataConsoleComponent } from './scan-data-dialog/scan-console-wrapper/scan-data-console/scan-data-console.component';
import { DataBaseExistWarningPopupComponent } from './shared/data-base-exist-warning-popup/data-base-exist-warning-popup.component';
import { DqdDialogComponent } from './dqd-dialog/dqd-dialog.component';
import { DqdConsoleWrapperComponent } from './dqd-dialog/dqd-console-wrapper/dqd-console-wrapper.component';
import { DqdConsoleComponent } from './dqd-dialog/dqd-console-wrapper/dqd-console/dqd-console.component';
import { DqdFormComponent } from './dqd-dialog/dqd-form/dqd-form.component';
import { SharedModule } from '../shared/shared.module';
import { FakeConsoleComponent } from './fake-data-dialog/fake-console-wrapper/fake-console/fake-console.component';

@NgModule({
  declarations: [
    TablesToScanComponent,
    TableToScanComponent,
    ScanParamsComponent,
    ScanDataFormComponent,
    ScanDataCheckboxComponent,
    ConnectionErrorPopupComponent,
    ScanDataDialogComponent,
    ConnectFormComponent,
    DbSettingsFormComponent,
    FileSettingsFormComponent,
    FakeDataDialogComponent,
    FakeConsoleWrapperComponent,
    FakeDataFormComponent,
    ScanConsoleWrapperComponent,
    CdmDialogComponent,
    CdmFormComponent,
    CdmConnectFormComponent,
    CdmFakeDataFormComponent,
    TestConnectionComponent,
    CdmDestinationFormComponent,
    CdmSourceFormComponent,
    CdmConsoleWrapperComponent,
    CdmConsoleComponent,
    ScanDataConsoleComponent,
    DataBaseExistWarningPopupComponent,
    DqdDialogComponent,
    DqdConsoleWrapperComponent,
    DqdConsoleComponent,
    DqdFormComponent,
    FakeConsoleComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [
    ScanDataDialogComponent,
    FakeDataDialogComponent,
    CdmDialogComponent,
    DqdDialogComponent
  ]
})
export class ScanDataModule { }
