import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-open-save-dialog',
  templateUrl: './open-save-dialog.component.html',
  styleUrls: ['./open-save-dialog.component.scss']
})
export class OpenSaveDialogComponent implements OnInit {

  @ViewChild('item', { static: true }) versionElement: MatSelect;
  items = [];
  resultValue;

  constructor(
    public dialogRef: MatDialogRef<OpenSaveDialogComponent>,
    private dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (this.data.type === 'select') {
      this.resultValue = this.data.items[0];
    }
  }

  ngOnInit() {
    if (this.data.type === 'select') {
      this.versionElement.focus();
    }
  }


}
