import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { ITable } from 'src/app/models/table';

const ELEMENT_DATA: any[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: 'app-sample-data-popup',
  templateUrl: './sample-data-popup.component.html',
  styleUrls: ['./sample-data-popup.component.scss']
})
export class SampleDataPopupComponent implements OnInit {
  dataSource = ELEMENT_DATA;
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];

  constructor(
    public dialogRef: MatDialogRef<SampleDataPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public table: ITable
    ) { }

  ngOnInit() {}

  get title() {
    return this.table.name;
  }

  get subtitle() {
    const str = this.table.area;
    return str.charAt(0).toUpperCase() + str.slice(1) + ' table';
  }

}
