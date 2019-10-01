import { Component, OnInit, Input } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatMenuTrigger } from '@angular/material';
import { ITable, Table } from 'src/app/models/table';
import { IRow } from 'src/app/models/row';
import { BridgeService } from 'src/app/services/bridge.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  @Input() data: ITable[] | IRow[];
  @Input() menuTrigger: MatMenuTrigger;

  items = [];
  checkboxes: {
    [key: number]: boolean;
  } = {};

  constructor(private bridgeService: BridgeService) {}

  ngOnInit() {
    if (this.data) {
      for (let i = 0; i < this.data.length; i++) {
        this.checkboxes[i] = this.data[i].visible;
      }
    }
  }

  preventOnClick(e: MouseEvent) {
    e.stopPropagation();
  }

  isChecked(item: ITable | IRow) {
    const { id } = item;
    return this.checkboxes[id];
  }

  onCheckboxChange(e: MatCheckboxChange, item: ITable | IRow) {
    const { id } = item;
    this.checkboxes[id] = e.checked;
  }

  selectAll() {
    Object.values(this.checkboxes).forEach(value => (value = true));
  }

  deselectAll() {
    Object.values(this.checkboxes).forEach(value => (value = false));
  }

  canCheck(item): boolean {
    if (item instanceof Table) {
      return this.bridgeService.isTableConnected(item);
    } else {
      return false;
    }
  }

  apply() {
    Object.keys(this.checkboxes).forEach(
      key => (this.data[key].visible = this.checkboxes[key])
    );

    setTimeout(() => this.bridgeService.refreshAll(), 50);

    this.close();
  }

  close() {
    if (this.menuTrigger) {
      this.menuTrigger.closeMenu();
    }
  }
}
