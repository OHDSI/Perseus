import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef,
  AfterViewChecked
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-preview-popup',
  templateUrl: './preview-popup.component.html',
  styleUrls: ['./preview-popup.component.scss']
})
export class PreviewPopupComponent implements OnInit {
  get tables(): string[] {
    return Object.keys(this.data);
  }

  constructor(
    public dialogRef: MatDialogRef<PreviewPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {}
}
