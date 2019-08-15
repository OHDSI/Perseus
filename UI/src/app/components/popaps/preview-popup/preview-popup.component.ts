import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-preview-popup',
  templateUrl: './preview-popup.component.html',
  styleUrls: ['./preview-popup.component.scss']
})
export class PreviewPopupComponent implements OnInit {
  get mappingJson(): string {
    return this.json;
  }
  private json: string;

  constructor(
    public dialogRef: MatDialogRef<PreviewPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.json = JSON.stringify(data);
    }

  ngOnInit() {

  }

}
