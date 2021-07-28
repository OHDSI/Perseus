import { Component, Inject, OnInit } from '@angular/core';
import { MatListOption } from '@angular/material/list';
import { uniq } from 'src/app/infrastructure/utility';
import { OVERLAY_DIALOG_DATA } from '@services/overlay/overlay-dialog-data';
import { OverlayDialogRef } from '@services/overlay/overlay.service';
import { StoreService } from '@services/store.service';
import { State } from '@models/state';

@Component({
  selector: 'app-cdm-filter',
  templateUrl: './cdm-filter.component.html',
  styleUrls: ['./cdm-filter.component.scss']
})
export class CdmFilterComponent implements OnInit {
  title: string;
  saveKey: keyof State;
  targetTypes: string[] = [];
  options;
  uniqueTypes;
  selectedItems: string[] = [];
  selectedTypes: string[] = [];

  constructor(private storeService: StoreService,
              public dialogRef: OverlayDialogRef,
              @Inject(OVERLAY_DIALOG_DATA) public payload: any
  ) {
  }

  ngOnInit() {
    this.title = this.payload.title;
    this.saveKey = this.payload.saveKey;
    this.options = this.payload.options;
    this.uniqueTypes = uniq(Object.keys(this.options));
    this.targetTypes = [...this.targetTypes, 'Show All', ...this.uniqueTypes];
  }

  onTypeSelection(types: MatListOption[]) {
    this.selectedItems = [];
    this.selectedTypes = types.map(item => item.value);
    const showAllSelected = !!this.selectedTypes.find(x => x === 'Show All');
    const otherOptionsSelected = !!this.selectedTypes.find(x => x !== 'Show All');
    if (showAllSelected) {
      this.selectedTypes = this.uniqueTypes;
    }
    if (otherOptionsSelected) {
      this.selectedItems = this.selectedTypes
        .reduce((prev, cur) => {
          prev = [...prev, ...this.options[cur]];
          return prev;
        }, []);
    }

    const saveObject: any = {
      checkedTypes: types.map(item => item.value),
      types: this.selectedTypes,
      items: this.selectedItems
    };

    if (this.payload.optionalSaveKey) {
      const savedObject = {...this.storeService.state[this.payload.saveKey]} || {};
      savedObject[this.payload.optionalSaveKey] = saveObject;
      this.storeService.add(this.saveKey, savedObject);
    } else {
      this.storeService.add(this.saveKey, saveObject);
    }
  }

  isSelected(item) {
    return this.payload.checkedTypes.includes(item);
  }
}
