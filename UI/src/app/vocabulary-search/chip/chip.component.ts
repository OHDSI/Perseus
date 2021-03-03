import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-chip',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss']
})
export class ChipComponent {

  @Input()
  id: number;

  @Input()
  name: string;

  @Input()
  backgroundColor: string;

  @Output()
  delete = new EventEmitter<number>();

  onDelete() {
    this.delete.emit(this.id);
  }
}
