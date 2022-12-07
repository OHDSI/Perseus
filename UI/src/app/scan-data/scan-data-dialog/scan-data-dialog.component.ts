import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ScanConsoleWrapperComponent } from './scan-console-wrapper/scan-console-wrapper.component';
import { DbTypes } from '@scan-data/scan-data.constants';
import { ScanDataStateService } from '@services/white-rabbit/scan-data-state.service';
import { ConversionDialog } from '@scan-data/conversion-dialog'
import { Conversion } from '@models/conversion/conversion'
import { ScanDataService } from '@services/white-rabbit/scan-data.service'
import { ScanSettings } from '@models/white-rabbit/scan-settings'
import { ScanSettingsType } from '@models/white-rabbit/scan-settings-type'
import { DbSettings } from '@models/white-rabbit/db-settings'
import { FilesSettings } from '@models/white-rabbit/files-settings'
import { ConversionDialogStatus } from '@scan-data/conversion-dialog-status'
import { openErrorDialog, parseHttpError } from '@utils/error'
import { withLoading } from '@utils/loading'
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-scan-data-dialog',
  templateUrl: './scan-data-dialog.component.html',
  styleUrls: ['./scan-data-dialog.component.scss', '../styles/scan-dialog.scss', '../styles/scan-data-normalize.scss'],
})
export class ScanDataDialogComponent extends ConversionDialog {

  @ViewChild(ScanConsoleWrapperComponent)
  consoleWrapperComponent: ScanConsoleWrapperComponent

  conversion: Conversion | null = null
  project: string
  loading = false

  constructor(dialogRef: MatDialogRef<ScanDataDialogComponent>,
              private scanDataService: ScanDataService,
              private scanDataStateService: ScanDataStateService,
              private dialogService: MatDialog,
  ) {
    super(dialogRef);
  }

  get dataType() {
    return this.scanDataStateService.dataType
  }

  get showMySqlHint(): boolean {
    return this.dataType === DbTypes.MYSQL
  }

  onScanTables(data: {type: ScanSettingsType, settings: ScanSettings}): void {
    const {type, settings} = data;
    let request$
    if (type === ScanSettingsType.DATA_CONNECTION) {
      request$ = settings.dataConnectionService.sourceConnection.generateScanReport().pipe(map((conversion) => {
        conversion.dataConnectionService = settings.dataConnectionService
        return conversion
      }))
    } else if (type === ScanSettingsType.DB) {
      request$ = this.scanDataService.generateScanReportByDb(settings as DbSettings)
    } else {
      request$ = this.scanDataService.generateScanReportByFiles(settings as FilesSettings);
    }
    request$.pipe(withLoading(this)).subscribe(conversion => {
      conversion.dataConnection = settings.dataConnectionService
      this.conversion = conversion
      this.project = conversion.project
      this.index = ConversionDialogStatus.CONVERSION
    }, error => {
      openErrorDialog(this.dialogService, 'Failed to scan data', parseHttpError(error))
    })
  }
}
