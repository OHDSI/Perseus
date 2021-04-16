import { Component, ViewChild } from '@angular/core';
import { AbstractConsoleWrapperComponent } from '../../shared/scan-console-wrapper/abstract-console-wrapper.component';
import { DqdConsoleComponent } from './dqd-console/dqd-console.component';
import { dqdUrl } from '../../../app.constants';
import { DqdService } from '../../../services/data-quality-check/dqd.service';
import * as fileSaver from 'file-saver';
import { DbSettings } from '../../model/db-settings';
import { parseHttpError } from '../../../services/utilites/error';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-dqd-console-wrapper',
  templateUrl: './dqd-console-wrapper.component.html',
  styleUrls: [
    './dqd-console-wrapper.component.scss',
    '../../shared/scan-console-wrapper/console-wrapper.component.scss',
    '../../styles/scan-data-buttons.scss'
  ]
})
export class DqdConsoleWrapperComponent extends AbstractConsoleWrapperComponent {

  constructor(private dqdService: DqdService) {
    super();
  }

  @ViewChild(DqdConsoleComponent)
  scanDataConsoleComponent: DqdConsoleComponent;

  fileLoading = false;

  onFinish(result: string) {
    this.result = result;
  }

  onShowResult() {
    window.open(`${dqdUrl}/?result=${this.result}`, '_blank');
  }

  onSaveResult() {
    this.fileLoading = true

    this.dqdService.download(this.result)
      .pipe(
        finalize(() => this.fileLoading = false)
      )
      .subscribe(json => {
        const blob = new Blob([JSON.stringify(json)], {type: 'application/json'});
        const dbSettings = this.params.payload as DbSettings;
        fileSaver.saveAs(blob, `${dbSettings.database}.${dbSettings.schema}.json`);
      }, error =>
        this.showErrorMessage(parseHttpError(error))
      );
  }
}

