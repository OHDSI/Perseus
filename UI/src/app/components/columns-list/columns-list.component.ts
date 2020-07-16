import {
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { IRow } from 'src/app/models/row';
import { DataService } from 'src/app/services/data.service';
import { ValuesPopupComponent } from '../popups/values-popup/values-popup.component';
import { OverlayService } from 'src/app/services/overlay/overlay.service';
import { OverlayConfigOptions } from 'src/app/services/overlay/overlay-config-options.interface';

@Component({
  selector: 'app-columns-list',
  templateUrl: './columns-list.component.html',
  styleUrls: ['./columns-list.component.scss']
})
export class ColumnsListComponent {
  @Input() sourceRows: IRow[];

  @Output() columnsSelected = new EventEmitter<string[]>();

  selected = [];

  constructor(
    private dataService: DataService,
    private overlayService: OverlayService
  ) {}

  onSelectColumn(name: string) {
    const itemSelected = this.selected.find(x => x === name);
    if (itemSelected) {
      this.selected = this.selected.filter(it => it !== name);
    } else {
      this.selected = [...this.selected, name];
    }

    this.columnsSelected.emit(this.selected);
  }

  showTop10Values(event: any, htmlElement: any, item: IRow) {
    event.stopPropagation();

    const { tableName, name } = item;
    this.dataService.getTopValues(tableName, name).subscribe(result => {
      const component = ValuesPopupComponent;

      const dialogOptions: OverlayConfigOptions = {
        hasBackdrop: true,
        backdropClass: 'custom-backdrop',
        positionStrategyFor: 'values',
        payload: { items: result }
      };

      this.overlayService.open(dialogOptions, htmlElement, component);
    });
  }
}
