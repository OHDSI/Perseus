import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { ITable } from 'src/app/models/table';
import { IRow } from 'src/app/models/row';
import { DataService } from 'src/app/services/data.service';
import { ValuesPopupComponent } from '../popaps/values-popup/values-popup.component';
import { OverlayService } from 'src/app/services/overlay.service';

@Component({
  selector: 'app-columns-list',
  templateUrl: './columns-list.component.html',
  styleUrls: ['./columns-list.component.scss']
})
export class ColumnsListComponent implements OnInit, OnChanges {
  @Input() tables: ITable[];
  @Output() columnsSelected = new EventEmitter<string[]>();

  selectedColumns = [];
  sourceRows: IRow[];

  constructor(private dataService: DataService, private overlayService: OverlayService) {}

  ngOnInit() {

  }

  ngOnChanges() {
    this.sourceRows = this.tables
    .map(table => table.rows)
    .reduce((p, k) => p.concat.apply(p, k), []);
  }

  onSelectColumn(name: string) {
    const idx = this.selectedColumns.findIndex(x => x === name);
    if (idx > -1) {
      this.selectedColumns.splice(idx, 1);
    } else {
      this.selectedColumns.push(name);
    }

    this.selectedColumns = Object.assign([], this.selectedColumns);
    this.columnsSelected.emit(this.selectedColumns);
  }

  showTop10Values(event: any, htmlElement: any, item: IRow) {
    event.stopPropagation();

    const {tableName, name} = item;
    this.dataService.getTopValues(tableName, name).subscribe(result => {
      const component = ValuesPopupComponent;
      this.overlayService.openDialog(htmlElement, component, 'values', result);
    });
  }
}
