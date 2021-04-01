import { Component, Inject } from '@angular/core';
import { OVERLAY_DIALOG_DATA } from 'src/app/services/overlay/overlay-dialog-data';
import { OverlayDialogRef } from 'src/app/services/overlay/overlay.service';

@Component({
  selector: 'app-select-table-dropdown',
  templateUrl: './select-table-dropdown.component.html',
  styleUrls: ['./select-table-dropdown.component.scss']
})
export class SelectTableDropdownComponent {

  constructor(public dialogRef: OverlayDialogRef,
              @Inject(OVERLAY_DIALOG_DATA) public payload: any
  ) {
  }

  onSelectionChange(event: any) {
    this.payload.selected = event;
    this.dialogRef.close();
  }

  remove(table: any) {
    this.dialogRef.close(table);
  }
}
