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
  cdmTypes: Object;
  selectedTables: string[] = [];
  selectedTypes: string[] = [];
  @Output() complete = new EventEmitter<void>();
  
  constructor() { }

  ngOnInit() {
    this.cdmTypes = (data as any).default
    const uniqueCdmTypes = uniq(Object.keys(this.cdmTypes));
    this.targetTypes = [...this.targetTypes, 'Show All', ...uniqueCdmTypes ];
  }

  onTypeSelection(types: MatListOption[]){
    this.selectedTables = []
    this.selectedTypes = types.map(item => item.value)
    const showAllSelected = !!this.selectedTypes.find(x => x == 'Show All')
    const otherOptionsSelected = !!this.selectedTypes.find(x => x != 'Show All')
    if (showAllSelected) {
      this.selectedTypes = uniq(Object.keys(this.cdmTypes))
    }
    if (otherOptionsSelected) {
      this.selectedTypes.map(item => this.selectedTables = [...this.selectedTables, ...this.cdmTypes[item]])
    }
    this.complete.emit();
  }
}
