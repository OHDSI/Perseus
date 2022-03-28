import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CdmConsoleWrapperComponent } from './cdm-console-wrapper/cdm-console-wrapper.component';
import { CdmSettings } from '@models/cdm-builder/cdm-settings';
import { DbTypes } from '../scan-data.constants';
import { StoreService } from '@services/store.service';
import { adaptDestinationCdmSettings } from '@utils/cdm-adapter';
import { CdmStateService } from '@services/cdm-builder/cdm-state.service';
import { ConversionDialog } from '@scan-data/conversion-dialog'
import { Conversion } from '@models/conversion/conversion'
import { CdmBuilderService } from '@services/cdm-builder/cdm-builder.service'
import { AdditionalStatusesForCdmBuilderDialog, ConversionDialogStatus } from '@scan-data/conversion-dialog-status'
import { switchMap, tap } from 'rxjs/operators'
import { openErrorDialog, parseHttpError } from '@utils/error'
import { FakeDataSettings } from '@models/white-rabbit/fake-data-settings'
import { UserSchemaService } from '@services/perseus/user-schema.service'
import { FakeDataService } from '@services/white-rabbit/fake-data.service'
import { DataQualityCheckService } from '@services/data-quality-check/data-quality-check.service'

@Component({
  selector: 'app-cdm-dialog',
  templateUrl: './cdm-dialog.component.html',
  styleUrls: ['./cdm-dialog.component.scss', '../styles/scan-dialog.scss', '../styles/scan-data-normalize.scss']
})
export class CdmDialogComponent extends ConversionDialog {

  @ViewChild(CdmConsoleWrapperComponent)
  consoleWrapperComponent: CdmConsoleWrapperComponent

  conversion: Conversion | null = null
  project: string

  private cdmSettings: CdmSettings

  constructor(dialogRef: MatDialogRef<CdmDialogComponent>,
              private storeService: StoreService,
              private cdmStateService: CdmStateService,
              private cdmBuilderService: CdmBuilderService,
              private dialogService: MatDialog,
              private schemaService: UserSchemaService,
              private fakeDataService: FakeDataService,
              private dataQualityCheckService: DataQualityCheckService) {
    super(dialogRef);
  }

  get dataType() {
    return this.cdmStateService.sourceDataType
  }

  get showMySqlWarning() {
    return this.dataType === DbTypes.MYSQL
  }

  get header(): string {
    switch (this.index) {
      case ConversionDialogStatus.SET_PARAMETERS:
      case ConversionDialogStatus.CONVERSION: {
        return 'Convert to CDM';
      }
      case AdditionalStatusesForCdmBuilderDialog.FAKE_DATA_GENERATION: {
        return 'Fake Data Generation';
      }
      case AdditionalStatusesForCdmBuilderDialog.DATA_QUALITY_CHECK: {
        return 'Data Quality Check';
      }
    }
  }

  onConvert(cdmSettings: CdmSettings): void {
    this.cdmBuilderService.addMapping()
      .pipe(
        switchMap(conversion => {
          this.conversion = conversion
          this.cdmSettings = {...cdmSettings, conversionId: this.conversion.id}
          return this.cdmBuilderService.convert(this.cdmSettings)
        })
      )
      .subscribe(
        () => this.index = ConversionDialogStatus.CONVERSION,
        error => openErrorDialog(this.dialogService, 'Failed to convert data', parseHttpError(error))
      )
  }

  onGenerateFakeData(fakeDataSettings: FakeDataSettings) {
    this.schemaService.getUserSchema()
      .pipe(
        tap(schema => fakeDataSettings.userSchema = schema),
        switchMap(() => this.fakeDataService.generateFakeData(fakeDataSettings))
      )
      .subscribe(conversion => {
        this.conversion = conversion
        this.index = AdditionalStatusesForCdmBuilderDialog.FAKE_DATA_GENERATION;
      }, error => {
        openErrorDialog(this.dialogService, 'Failed to generate Fake data', parseHttpError(error))
      })
  }

  onDataQualityCheck() {
    const dbSettings = adaptDestinationCdmSettings(this.cdmSettings)
    this.dataQualityCheckService.dataQualityCheck(dbSettings)
      .subscribe(conversion => {
        this.conversion = conversion
        this.project = conversion.project
        this.index = AdditionalStatusesForCdmBuilderDialog.DATA_QUALITY_CHECK
      }, error => {
        openErrorDialog(this.dialogService, 'Failed to data quality check', parseHttpError(error))
      })
  }
}
