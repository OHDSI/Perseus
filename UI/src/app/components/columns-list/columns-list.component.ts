import { Component, EventEmitter, Input, Output, } from '@angular/core';
import { IRow } from 'src/app/models/row';
import { DataService } from 'src/app/services/data.service';
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

  constructor(
    private dataService: DataService,
    private overlayService: OverlayService
  ) {
  }

  onSelect(name: string) {
    const itemSelected = this.selected.find(x => x === name);
    if (itemSelected) {
      this.selected = this.selected.filter(it => it !== name);
    } else {
      this.selected = [...this.selected, name];
    }

    this.columnsSelected.emit(this.selected);
  }

  deselectAll() {
    if (this.selected.length) {
      this.selected = [];
      this.columnsSelected.emit(this.selected);
    }
  }

  showColumnInfo(event: any, htmlElement: any, item: IRow) {
    event.stopPropagation();

    const { tableName, name } = item;

    this.dataService.getColumnInfo(tableName, name).subscribe(result => {
      const componentType = ColumnInfoComponent;

      const dialogOptions: OverlayConfigOptions = {
        hasBackdrop: true,
        backdropClass: 'custom-backdrop',
        positionStrategyFor: 'values',
        payload: result
      };

      this.overlayService.open(dialogOptions, htmlElement, componentType);
    });
  }
}
