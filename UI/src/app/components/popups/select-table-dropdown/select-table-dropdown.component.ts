import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { ITable } from 'src/app/models/table';
import { OVERLAY_DIALOG_DATA } from 'src/app/services/overlay/overlay-dialog-data';
import { OverlayDialogRef } from 'src/app/services/overlay/overlay.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-select-table-dropdown',
  templateUrl: './select-table-dropdown.component.html',
  styleUrls: ['./select-table-dropdown.component.scss']
})
export class SelectTableDropdownComponent implements OnInit {

  constructor(private storeService: StoreService,
              public dialogRef: OverlayDialogRef,
              @Inject(OVERLAY_DIALOG_DATA) public payload: any
  ) {
  }
  ngOnInit(): void {
  }

  onSelectionChange(event: any) {
      this.payload.selected = event;
      this.dialogRef.close();
  }

  getName(table: any){
    return this.payload.clone ? table.cloneName : table.name.startsWith('cdm~') ? table.name.replace('cdm~', '') : table.name;
  }

  remove(table: any){
    this.dialogRef.close(table);
  }
}
