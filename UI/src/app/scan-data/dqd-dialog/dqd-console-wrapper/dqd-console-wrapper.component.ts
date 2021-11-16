import { Component, ViewChild } from '@angular/core';
import { AbstractConsoleWrapperComponent } from '../../auxiliary/scan-console-wrapper/abstract-console-wrapper-component.directive';
import { DqdConsoleComponent } from './dqd-console/dqd-console.component';
import { dqdServerUrl } from '@app/app.constants';
import { DqdService } from '@services/data-quality-check/dqd.service';
import * as fileSaver from 'file-saver';
import { DbSettings } from '@models/scan-data/db-settings';
import { parseHttpError } from '@utils/error';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-dqd-console-wrapper',
  templateUrl: './dqd-console-wrapper.component.html',
  styleUrls: [
    './dqd-console-wrapper.component.scss',
    '../../auxiliary/scan-console-wrapper/console-wrapper.component.scss',
    '../../styles/scan-data-buttons.scss'
  ]
})
export class DqdConsoleWrapperComponent extends AbstractConsoleWrapperComponent<string> {

  constructor(private dqdService: DqdService) {
    super();
  }

  @ViewChild(DqdConsoleComponent)
  consoleComponent: DqdConsoleComponent;

  fileLoading = false;

  onShowResult() {
    window.open(`${dqdServerUrl}/?result=${this.result.payload}`, '_blank');
  }

  onSaveResult() {
    this.fileLoading = true

    this.dqdService.download(this.result.payload)
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

