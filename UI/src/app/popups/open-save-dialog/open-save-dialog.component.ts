import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { SaveModel } from '@models/popup/save-model';
import { parseHttpError } from '@utils/error';

@Component({
  selector: 'app-open-save-dialog',
  templateUrl: './open-save-dialog.component.html',
  styleUrls: [ './open-save-dialog.component.scss' ]
})
export class OpenSaveDialogComponent implements OnInit {

  @ViewChild('item', { static: true }) versionElement: MatSelect;
  items = [];
  resultValue;
  loading = false

  constructor(
    public dialogRef: MatDialogRef<OpenSaveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SaveModel,
    private cdr: ChangeDetectorRef
  ) {
    if (this.data.type === 'select') {
      this.resultValue = this.data.items[ 0 ];
    }
  }

  ngOnInit() {
    if (this.data.type === 'select') {
      this.versionElement.focus();
    }
  }

  inputNameError() {
    return this.data.existingNames?.includes(this.resultValue);
  }

  save() {
    const action = this.data.okButton
    if (this.data.save$) {
      this.loading = true
      this.runSave(action)
    } else {
      this.dialogRef.close({action, value: this.resultValue})
    }
  }

  disabled() {
    return this.loading || this.data.type === 'input' && (!this.resultValue || this.inputNameError())
  }

  private runSave(action: string) {
    setTimeout(() => this.data.save$(this.resultValue)
      .subscribe(
        value => this.dialogRef.close({action, value}),
        error => this.dialogRef.close({action, value: parseHttpError(error)})
      ),
      1000
    )
  }
}
