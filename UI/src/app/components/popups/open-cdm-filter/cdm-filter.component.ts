import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import * as data from './CdmByTypes.json';
import { MatListOption } from '@angular/material/list';
import { uniq } from 'src/app/infrastructure/utility';



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
  @Output() complete = new EventEmitter<void>();
  
  constructor() { }

  ngOnInit() {
    this.targetTypes = [...this.targetTypes, 'Show All', ...this.uniqueCdmTypes ];
  }

  onTypeSelection(types: MatListOption[]){
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
    this.complete.emit();
  }
}
