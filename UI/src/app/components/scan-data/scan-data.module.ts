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

@NgModule({
  declarations: [
    ScanDataComponent,
    SourceFormComponent,
    TablesToScanComponent,
    TableToScanComponent,
    ScanParamsComponent,
    ScanDataFormComponent,
    ScanDataCheckboxComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatIconModule,
    MatProgressBarModule
  ],
  exports: [
    ScanDataComponent
  ]
})
export class ScanDataModule { }
