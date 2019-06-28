import { Component, OnInit, Input } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatMenuTrigger } from '@angular/material';

import { DrawService } from 'src/app/services/draw.service';
import { ITable } from 'src/app/models/table';
import { IRow } from 'src/app/models/row';

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

  constructor(private drawService: DrawService) {}

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
    const {id} = item;
    return this.checkboxes[id];
  }

  onCheckboxChange(e: MatCheckboxChange, item: ITable | IRow) {
    const {id} = item;
    this.checkboxes[id] = e.checked;
  }

  selectAll() {
    for (let id in this.checkboxes) {
      this.checkboxes[id] = true;
    }
  }
  deselectAll() {
    for (let id in this.checkboxes) {
      this.checkboxes[id] = false;
    }
  }

  apply() {
    const length = Object.keys(this.checkboxes).length;
    if (length) {
      for (const key in this.checkboxes) {
        this.data[key].visible = this.checkboxes[key];
      }
    }


    this.drawService.removeAllConnectors();
    this.close();
  }

  close() {
    this.menuTrigger.closeMenu();
  }
}
