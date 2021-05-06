import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-save-vocabulary-popup',
  templateUrl: './save-vocabulary-popup.component.html',
  styleUrls: ['./save-vocabulary-popup.component.scss']
})
export class SaveVocabularyPopupComponent {

  name: string

  constructor(public dialogRef: MatDialogRef<SaveVocabularyPopupComponent>) {
  }

  get disabled() {
    return !this.name
  }

  onApply() {
    this.dialogRef.close(this.name)
  }
}
