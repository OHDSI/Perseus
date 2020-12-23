import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { fileToBase64AsObservable } from '../../../../../services/utilites/base64-util';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../../../../shared/base/base.component';
import { FileToScan } from '../../../../model/file-to-scan';

@Component({
  selector: 'app-file-settings-form',
  templateUrl: './file-settings-form.component.html',
  styleUrls: [
    '../connect-form.component.scss',
    '../../../../styles/scan-data-form.scss',
    '../../../../styles/file-input.scss',
    '../../../../styles/scan-data-connect-form.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileSettingsFormComponent extends BaseComponent {

  @Input()
  form: FormGroup;

  @Output()
  fileToScanChanged = new EventEmitter<FileToScan[]>();

  @Input()
  fileInputText = '';

  get disabled() {
    return this.form.get('delimiter').disabled;
  }

  constructor() {
    super();
  }

  onFileInputChange(event): void {
    const files = Array.from(event.target.files) as File[];
    const files$ = files.map(file => fileToBase64AsObservable(file));

    forkJoin(files$)
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(filesToScan =>
        this.fileToScanChanged.emit(filesToScan)
      );

    if (files.length === 0) {
      this.fileInputText = '';
    } else {
      const initial = files.shift().name;
      this.fileInputText = files
        .reduce((res, file) => `${res}, ${file.name}`, initial);
    }
  }
}
