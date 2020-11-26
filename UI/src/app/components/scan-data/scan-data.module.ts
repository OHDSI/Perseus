import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { ScanDataComponent } from './scan-data.component';
import { SourceFormComponent } from './scan-data-form/source-form/source-form.component';
import { TablesToScanComponent } from './scan-data-form/tables-to-scan/tables-to-scan.component';
import { TableToScanComponent } from './scan-data-form/tables-to-scan/table-to-scan/table-to-scan.component';
import { ScanDataFormComponent } from './scan-data-form/scan-data-form.component';
import { ScanParamsComponent } from './scan-data-form/tables-to-scan/scan-params/scan-params.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ScanDataCheckboxComponent } from './scan-data-form/scan-data-checkbox/scan-data-checkbox.component';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { ScanDataProgressComponent } from './scan-data-progress/scan-data-progress.component';
import { WebsocketModule } from '../../websocket/websocket.module';
import { ConnectionErrorPopupComponent } from './scan-data-form/connection-error-popup/connection-error-popup.component';

@NgModule({
  declarations: [
    ScanDataComponent,
    SourceFormComponent,
    TablesToScanComponent,
    TableToScanComponent,
    ScanParamsComponent,
    ScanDataFormComponent,
    ScanDataCheckboxComponent,
    ScanDataProgressComponent,
    ConnectionErrorPopupComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatIconModule,
    MatProgressBarModule,
    CdkStepperModule,
    WebsocketModule
  ],
  exports: [
    ScanDataComponent
  ]
})
export class ScanDataModule { }
