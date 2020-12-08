import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { TablesToScanComponent } from './scan-data-dialog/scan-data-form/tables-to-scan/tables-to-scan.component';
import { TableToScanComponent } from './scan-data-dialog/scan-data-form/tables-to-scan/table-to-scan/table-to-scan.component';
import { ScanDataFormComponent } from './scan-data-dialog/scan-data-form/scan-data-form.component';
import { ScanParamsComponent } from './scan-data-dialog/scan-data-form/tables-to-scan/scan-params/scan-params.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ScanDataCheckboxComponent } from './shared/scan-data-checkbox/scan-data-checkbox.component';
import { ScanDataConsoleComponent } from './shared/scan-console-wrapper/scan-data-console/scan-data-console.component';
import { WebsocketModule } from '../websocket/websocket.module';
import { ConnectionErrorPopupComponent } from './shared/connection-error-popup/connection-error-popup.component';
import { CloseDialogButtonComponent } from './shared/close-dialog-button/close-dialog-button.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ScanDataDialogComponent } from './scan-data-dialog/scan-data-dialog.component';
import { ConnectFormComponent } from './shared/connect-form/connect-form.component';
import { MatIconModule } from '@angular/material/icon';
import { ClickOutsideDirective } from './shared/click-outside/click-outside.directive';
import { DbSettingsFormComponent } from './shared/connect-form/db-settings-form/db-settings-form.component';
import { FileSettingsFormComponent } from './shared/connect-form/file-settings-form/file-settings-form.component';
import { FakeDataDialogComponent } from './fake-data-dialog/fake-data-dialog.component';
import { FakeConsoleWrapperComponent } from './fake-data-dialog/fake-console-wrapper/fake-console-wrapper.component';
import { FakeDataFormComponent } from './fake-data-dialog/fake-data-form/fake-data-form.component';
import { ScanConsoleWrapperComponent } from './scan-data-dialog/scan-console-wrapper/scan-console-wrapper.component';

@NgModule({
  declarations: [
    TablesToScanComponent,
    TableToScanComponent,
    ScanParamsComponent,
    ScanDataFormComponent,
    ScanDataCheckboxComponent,
    ScanDataConsoleComponent,
    ConnectionErrorPopupComponent,
    CloseDialogButtonComponent,
    ScanDataDialogComponent,
    ConnectFormComponent,
    ClickOutsideDirective,
    DbSettingsFormComponent,
    FileSettingsFormComponent,
    FakeDataDialogComponent,
    FakeConsoleWrapperComponent,
    FakeDataFormComponent,
    ScanConsoleWrapperComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatIconModule,
    WebsocketModule
  ],
  exports: [
    ScanDataDialogComponent,
    FakeDataDialogComponent
  ],
})
export class ScanDataModule { }
