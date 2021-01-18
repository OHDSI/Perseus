import { Component, EventEmitter, Input, Output, } from '@angular/core';
import { IRow } from 'src/app/models/row';
import { OverlayConfigOptions } from 'src/app/services/overlay/overlay-config-options.interface';
import { OverlayService } from 'src/app/services/overlay/overlay.service';
import { ColumnInfoComponent } from '../field-information/column-info.component';

@Component({
  selector: 'app-columns-list',
  templateUrl: './columns-list.component.html',
  styleUrls: ['./columns-list.component.scss']
})
export class ColumnsListComponent {
  @Input() uniqSourceRows: IRow[];

  @Input() allSourceRows: IRow[];

  @Output() columnsSelected = new EventEmitter<string[]>();

  selected = [];

  onSelect(name: string) {
    const itemSelected = this.selected.find(x => x === name);
    if (itemSelected) {
      this.selected = this.selected.filter(it => it !== name);
    } else {
      this.selected = [...this.selected, name];
    }

    this.columnsSelected.emit(this.selected);
  }

  constructor(
    private overlayService: OverlayService
  ) {
  }

  deselectAll() {
    if (this.selected.length) {
      this.selected = [];
      this.columnsSelected.emit(this.selected);
    }
  }

  showColumnInfo(event: any, htmlElement: any, item: IRow) {
    event.stopPropagation();

    const columnName = item.name;
    const tableNames = this.allSourceRows
      .filter(row => row.name === columnName)
      .map(row => row.tableName);

    const payload = {
      columnName,
      tableNames
    };

    const componentType = ColumnInfoComponent;

    const dialogOptions: OverlayConfigOptions = {
      hasBackdrop: true,
      backdropClass: 'custom-backdrop',
      positionStrategyFor: 'values',
      payload
    };

    this.overlayService.open(dialogOptions, htmlElement, componentType);
  }
}
