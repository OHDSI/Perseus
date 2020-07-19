import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import  *  as  data  from  './CdmByTypes.json';
import { MatListOption } from '@angular/material/list';
import { uniq } from 'src/app/infrastructure/utility';



@Component({
  selector: 'app-cmd-filter',
  templateUrl: './cmd-filter.component.html',
  styleUrls: ['./cmd-filter.component.scss']
})
export class CmdFilterComponent implements OnInit {

  targetTypes: string [] = []
  cdmByTypes:Map<string, string[]>
  selectedTables:string[] = []
  selectedTypes:string[] = []
  @Output() complete = new EventEmitter<void>();
  
  constructor() { }

  ngOnInit() {
    this.cdmByTypes = (data as any).default
    this.targetTypes.push("Show All")
    this.targetTypes = this.targetTypes.concat(uniq(Object.keys(this.cdmByTypes)))
  }

  onTypeSelection(types: MatListOption[]){
    this.selectedTables=[]
    this.selectedTypes = types.map(item => item.value)
    for (var item of this.selectedTypes){
      if (item=="Show All"){
        this.selectedTables = []
        this.selectedTypes = uniq(Object.keys(this.cdmByTypes))
        break
      }
      this.selectedTables = this.selectedTables.concat(this.cdmByTypes[item])
    }
    this.complete.emit();
  }
}
