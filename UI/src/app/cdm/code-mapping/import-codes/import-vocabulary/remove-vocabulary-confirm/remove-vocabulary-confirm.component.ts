import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-remove-vocabulary-confirm',
  templateUrl: './remove-vocabulary-confirm.component.html',
  styleUrls: ['./remove-vocabulary-confirm.component.scss']
})
export class RemoveVocabularyConfirmComponent {

  constructor(public dialogRef: MatDialogRef<RemoveVocabularyConfirmComponent>,
              @Inject(MAT_DIALOG_DATA) public name: string) {
  }
}
