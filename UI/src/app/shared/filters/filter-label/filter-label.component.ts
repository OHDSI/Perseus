import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-filter-label',
  templateUrl: './filter-label.component.html',
  styleUrls: ['./filter-label.component.scss']
})
export class FilterLabelComponent {

  @Input()
  name: string;

  @Input()
  color: string;
}
