import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-overwrite-vocab',
  templateUrl: './confirm-overwrite-vocab.component.html',
  styleUrls: ['./confirm-overwrite-vocab.component.scss']
})
export class ConfirmOverwriteVocabComponent {

  constructor(public dialogRef: MatDialogRef<ConfirmOverwriteVocabComponent>) {
  }
}
