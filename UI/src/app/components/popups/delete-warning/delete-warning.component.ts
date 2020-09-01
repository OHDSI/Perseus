import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-warning',
  templateUrl: './delete-warning.component.html',
  styleUrls: ['./delete-warning.component.scss', '../cdm-version-dialog/cdm-version-dialog.component.scss']
})
export class DeleteWarningComponent {

  title;
  message;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.title = data.title;
    this.message = data.message;
  }
}
