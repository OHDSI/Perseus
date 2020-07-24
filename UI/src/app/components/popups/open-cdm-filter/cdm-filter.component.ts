import { Component, Inject, OnInit } from '@angular/core';
import { MatListOption } from '@angular/material/list';
import { uniq } from 'src/app/infrastructure/utility';
import { OVERLAY_DIALOG_DATA } from '../../../services/overlay/overlay-dialog-data';
import { OverlayDialogRef } from '../../../services/overlay/overlay.service';
import { StoreService } from '../../../services/store.service';
import * as data from './CdmByTypes.json';

@Component({
  selector: 'app-cdm-filter',
  templateUrl: './cdm-filter.component.html',
  styleUrls: ['./cdm-filter.component.scss']
})
export class CdmFilterComponent implements OnInit {
  targetTypes: string[] = [];
  cdmTypes = (data as any).default;
  readonly uniqueCdmTypes = uniq(Object.keys(this.cdmTypes));
  selectedTables: string[] = [];
  selectedTypes: string[] = [];

  constructor(private storeService: StoreService,
              public dialogRef: OverlayDialogRef,
              @Inject(OVERLAY_DIALOG_DATA) public payload: any
  ) {
  }

  ngOnInit() {
    this.targetTypes = [...this.targetTypes, 'Show All', ...this.uniqueCdmTypes];
  }

  onTypeSelection(types: MatListOption[]) {
    this.selectedTables = [];
    this.selectedTypes = types.map(item => item.value);
    const showAllSelected = !!this.selectedTypes.find(x => x === 'Show All');
    const otherOptionsSelected = !!this.selectedTypes.find(x => x !== 'Show All');
    if (showAllSelected) {
      this.selectedTypes = this.uniqueCdmTypes;
    }
    if (otherOptionsSelected) {
      this.selectedTables = this.selectedTypes
        .reduce((prev, cur) => {
          prev = [...prev, ...this.cdmTypes[cur]];
          return prev;
        }, []);
    }
    this.storeService.add('filtered', {types: this.selectedTypes, tables: this.selectedTables});
    this.storeService.add('checkedTypes', types.map(item => item.value))
  }

  isSelected(item) {
    return this.payload.checkedTypes.includes(item);
  }
}
