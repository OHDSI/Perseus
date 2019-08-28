import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { StateService } from 'src/app/services/state.service';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-comfy',
  templateUrl: './comfy.component.html',
  styleUrls: ['./comfy.component.scss']
})
export class ComfyComponent implements OnInit {
  busy = true;

  get state() {
    return this.stateService.state;
  }

  get targetTables(): string[] {
    return Object.keys(this.target);
  }

  source = [];
  target = {};
  sourceConnectedTo = [];

  constructor(
    private dataService: DataService,
    private stateService: StateService
  ) {}

  ngOnInit() {
    this.dataService.initialize().subscribe(_ => {
      this.source = this.state.source.tables.map(table => table.name);
      this.state.target.tables.map(table => {
        this.target[table.name] = {};
        this.target[table.name].name = `idx-${table.name}`;
        this.target[table.name].data = [table.name];
      });

      this.sourceConnectedTo = this.state.target.tables.map(table => `idx-${table.name}`);

      this.busy = false;
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
