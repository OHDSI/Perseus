import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseComponent } from '../../../../../base/base.component';

@Component({
  selector: 'app-file-settings-form',
  templateUrl: './file-settings-form.component.html',
  styleUrls: [
    '../connect-form.component.scss',
    '../../../../styles/scan-data-form.scss',
    '../../../../styles/file-input.scss',
    '../../../../styles/scan-data-connect-form.scss'
  ]
})
export class FileSettingsFormComponent extends BaseComponent {

  @Input()
  form: FormGroup;

  @Output()
  fileToScanChanged = new EventEmitter<File[]>();

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
    if (files.length === 0) {
      this.fileInputText = '';
    } else {
      const initial = files[0].name;
      this.fileInputText = files
        .slice(1)
        .reduce((res, file) => `${res}, ${file.name}`, initial);
    }
    this.fileToScanChanged.emit(files)
  }
}
