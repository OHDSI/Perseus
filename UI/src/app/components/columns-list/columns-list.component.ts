import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ITable } from 'src/app/models/table';
import { IRow } from 'src/app/models/row';
import { DataService } from 'src/app/services/data.service';
import { MatDialog } from '@angular/material';
import { ValuesPopupComponent } from '../popaps/values-popup/values-popup.component';
import { OverlayService } from 'src/app/services/overlay.service';

@Component({
  selector: 'app-columns-list',
  templateUrl: './columns-list.component.html',
  styleUrls: ['./columns-list.component.scss']
})
export class ColumnsListComponent implements OnInit {
  @Input() data: ITable[] | IRow[];
  @Output() columnsSelected = new EventEmitter<string[]>();

  selectedColumns = [];
  constructor(private dataService: DataService, private matDialog: MatDialog, private overlayService: OverlayService) {}

  ngOnInit() {}

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
      // const dialog = this.matDialog.open(ValuesPopupComponent, {
      //   data: { values: result }
      // });

      // dialog.afterClosed().subscribe(save => {});
      //ValuesPopupComponent.data = result;
      const component = ValuesPopupComponent;
      this.overlayService.openDialog(htmlElement, component, 'values', result);
    });
  }
}
