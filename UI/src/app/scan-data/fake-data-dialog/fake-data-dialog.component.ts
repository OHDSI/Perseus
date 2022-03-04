import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { StoreService } from '@services/store.service';
import { FakeConsoleWrapperComponent } from './fake-console-wrapper/fake-console-wrapper.component';
import { FakeDataSettings } from '@models/white-rabbit/fake-data-settings';
import { ConversionDialog } from '@scan-data/conversion-dialog'
import { Conversion } from '@models/conversion/conversion'
import { FakeDataService } from '@services/white-rabbit/fake-data.service'
import { UserSchemaService } from '@services/perseus/user-schema.service'
import { switchMap, tap } from 'rxjs/operators'
import { ConversionDialogStatus } from '@scan-data/conversion-dialog-status'
import { openErrorDialog, parseHttpError } from '@utils/error'

@Component({
  selector: 'app-fake-data-dialog',
  templateUrl: './fake-data-dialog.component.html',
  styleUrls: ['./fake-data-dialog.component.scss', '../styles/scan-dialog.scss', '../styles/scan-data-normalize.scss']
})
export class FakeDataDialogComponent extends ConversionDialog {

  @ViewChild(FakeConsoleWrapperComponent)
  consoleWrapperComponent: FakeConsoleWrapperComponent;

  conversion: Conversion | null = null;

  constructor(dialogRef: MatDialogRef<FakeDataDialogComponent>,
              private fakeDataService: FakeDataService,
              private storeService: StoreService,
              private schemaService: UserSchemaService,
              private dialogService: MatDialog) {
    super(dialogRef);
  }

  generateFakeData(fakeDataSettings: FakeDataSettings) {
    const {reportFile} = this.storeService.state;
    this.schemaService.getUserSchema()
      .pipe(
        tap(schema => fakeDataSettings.userSchema = schema),
        switchMap(() => this.fakeDataService.generateFakeData(fakeDataSettings, reportFile))
      )
      .subscribe(conversion => {
        this.conversion = conversion
        this.index = ConversionDialogStatus.CONVERSION
      }, error => {
        openErrorDialog(this.dialogService, 'Failed to Generate Fake data', parseHttpError(error))
      })
  }

  protected changeSize() {
    if (this.index === 0) {
      this.dialogRef.updateSize('285px', '280px');
    } else {
      this.dialogRef.updateSize('613px', '478px');
    }
  }
}
