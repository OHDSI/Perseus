import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

// todo refactor css
@Component({
  selector: 'app-person-mapping-warning-dialog',
  templateUrl: './person-mapping-warning-dialog.component.html',
  styleUrls: [
    './person-mapping-warning-dialog.component.scss',
    '../../scan-data/styles/scan-data-buttons.scss',
    '../../../scan-data/styles/scan-data-normalize.scss'
  ]
})
export class PersonMappingWarningDialogComponent {

  constructor(private dialogRef: MatDialogRef<PersonMappingWarningDialogComponent>) { }

  onCancel() {
    this.dialogRef.close(false);
  }

  onContinue() {
    this.dialogRef.close(true);
  }
}
