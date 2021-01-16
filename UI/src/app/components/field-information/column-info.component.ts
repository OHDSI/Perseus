import { Component, Inject } from '@angular/core';
import { OVERLAY_DIALOG_DATA } from '../../services/overlay/overlay-dialog-data';

export interface ValueInfo {
  value: string;
  frequency: string;
  percentage: string;
}

export interface ColumnInfo {
  name: string;
  type: string;
  uniqueValues: string;
  topValues: ValueInfo[];
}

@Component({
  selector: 'app-field-information',
  templateUrl: './column-info.component.html',
  styleUrls: ['./column-info.component.scss']
})
export class ColumnInfoComponent {

  constructor(@Inject(OVERLAY_DIALOG_DATA) public fieldInformation: ColumnInfo) {
  }
}
