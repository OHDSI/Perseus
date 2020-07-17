import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import  *  as  data  from  './CdmByTypes.json';
import { MatListOption } from '@angular/material/list';



@Component({
  selector: 'app-cmd-filter',
  templateUrl: './cmd-filter.component.html',
  styleUrls: ['./cmd-filter.component.scss']
})
export class CmdFilterComponent implements OnInit {

  targetTypes: string [] = []
  cdmByTypes:Map<string, string[]>
  selectedTables:string[] = []
  @Output() complete = new EventEmitter<string[]>();
  
  constructor() { }

  ngOnInit() {
    this.targetTypes.push("Show All")
    this.cdmByTypes = (data as any).default
     for (var value in this.cdmByTypes) {  
      this.targetTypes.push(value)  
    }
  }

  onTypeSelection(types: MatListOption[]){
    this.selectedTables=[]
    var selected = types.map(item => item.value)
    for (var item of selected){
      if (item=="Show All"){
        this.selectedTables = []
        break
      }
      this.selectedTables = this.selectedTables.concat(this.cdmByTypes[item])
    }
    this.complete.emit(this.selectedTables);
  }

}
