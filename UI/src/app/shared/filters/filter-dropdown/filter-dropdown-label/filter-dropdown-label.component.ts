import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-filter-dropdown-label',
  templateUrl: './filter-dropdown-label.component.html',
  styleUrls: ['./filter-dropdown-label.component.scss']
})
export class FilterDropdownLabelComponent {

  @Input()
  name: string;

  @Input()
  opened: boolean;

  @Output()
  open = new EventEmitter<string>();

  onOpen() {
    this.open.emit(this.name);
  }
}
