import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-grid-checkbox',
  templateUrl: './grid-checkbox.component.html',
  styleUrls: ['./grid-checkbox.component.scss']
})
export class GridCheckboxComponent {

  @Input()
  checked = false
}
