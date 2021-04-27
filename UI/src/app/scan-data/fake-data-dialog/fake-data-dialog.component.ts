import { Component, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AbstractScanDialog } from '../abstract-scan-dialog';
import { StoreService } from '../../services/store.service';
import { fakeDataDbSettings } from '../scan-data.constants';
import { FakeConsoleWrapperComponent } from './fake-console-wrapper/fake-console-wrapper.component';
import { FakeDataParams } from '../model/fake-data-params';

@Component({
  selector: 'app-fake-data-dialog',
  templateUrl: './fake-data-dialog.component.html',
  styleUrls: ['./fake-data-dialog.component.scss', '../styles/scan-dialog.scss', '../styles/scan-data-normalize.scss']
})
export class FakeDataDialogComponent extends AbstractScanDialog {

  @ViewChild(FakeConsoleWrapperComponent)
  consoleWrapperComponent: FakeConsoleWrapperComponent;

  constructor(dialogRef: MatDialogRef<FakeDataDialogComponent>, private storeService: StoreService) {
    super(dialogRef);
  }

  async onGenerate(params: { maxRowCount: number, doUniformSampling: boolean }) {
    const {reportFile, source} = this.storeService.state;
    const itemsToScanCount = source.length;
    const fakeDataParams: FakeDataParams = {
      ...params,
      dbSettings: fakeDataDbSettings
    };

    this.websocketParams = {
      payload: {
        params: fakeDataParams,
        report: reportFile
      },
      itemsToScanCount,
    };

    this.index = 1;
  }

  protected changeSize() {
    if (this.index === 0) {
      this.dialogRef.updateSize('265px', '280px');
    } else {
      this.dialogRef.updateSize('613px', '478px');
    }
  }
}
