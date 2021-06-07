import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild, } from '@angular/core';
import { IRow } from 'src/app/models/row';
import { OverlayConfigOptions } from 'src/app/services/overlay/overlay-config-options.interface';
import { OverlayService } from 'src/app/services/overlay/overlay.service';
import { ColumnInfoComponent } from './column-info/column-info.component';
import { getPositionStrategy } from '@comfy/columns-list/column-list';

@Component({
  selector: 'app-columns-list',
  templateUrl: './columns-list.component.html',
  styleUrls: ['./columns-list.component.scss']
})
export class ColumnsListComponent implements AfterViewInit {
  @Input() uniqSourceRows: IRow[];

  @Input() allSourceRows: IRow[];

  @Input() columnListHeight = '100%';

  @Output() columnsSelected = new EventEmitter<string[]>();

  selected = [];

  @ViewChild('columnList', {read: ElementRef, static: false})
  columnList: ElementRef

  private listHalfHeight: number
  private listTop: number

  constructor(private overlayService: OverlayService) {
  }

  ngAfterViewInit() {
    const {top, height} = this.columnList.nativeElement.getBoundingClientRect();
    this.listTop = top
    this.listHalfHeight = height / 2
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

  showColumnInfo(event: Event, htmlElement: HTMLElement, item: IRow) {
    event.stopPropagation();

    const columnName = item.name;
    const tableNames = this.allSourceRows
      .filter(row => row.name === columnName)
      .map(row => row.tableName);

    const componentType = ColumnInfoComponent;
    const positionStrategy = getPositionStrategy(htmlElement, this.listHalfHeight, this.listTop)

    const payload = {
      columnName,
      tableNames,
      positionStrategy,
      maxHeight: this.listHalfHeight
    };

    const dialogOptions: OverlayConfigOptions = {
      hasBackdrop: true,
      backdropClass: 'custom-backdrop',
      positionStrategyFor: `column-info-${positionStrategy}`,
      panelClass: 'field-info-popup',
      payload,
    };

    this.overlayService.open(dialogOptions, htmlElement, componentType);
  }
}
